import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, getCustomRepository, In } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    /**
     * This is a trick to use an async function on a parseCSV.
     * It'll wait until the parsing returns a status of 'end'
     */
    await new Promise(resolve => parseCSV.on('end', resolve));

    /**
     * This is going to search on out DB for every title In the
     * array of categories
     */
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    /**
     * We only want the title of the category, other information is
     * not necessary
     */
    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    /**
     * This is going to filter in two steps:
     * First: it filters all categories that aren't on our DB
     * Second: It's going to search for every title for duplicates
     * and removes(filters) that.
     */
    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      /**
       * Using JSON notation title => ({ title })
       */
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    /**
     * To delete the file after import
     */
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
