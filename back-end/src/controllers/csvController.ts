import { Request, Response } from "express";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import jsonHelper from "../utils/readJsonFile";
import removeRepitedObjects from "../utils/removeRepitedObjects";

export const save = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const csvData = [] as any;

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      csvData.push(row);
    })
    .on("end", () => {
      const storagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "data.json"
      );

      fsExtra.emptyDirSync(path.join(__dirname, "..", "..", "uploads"));

      fs.writeFile(storagePath, JSON.stringify(csvData), (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to save the file" });
        }

        res.status(200).json({
          message: "CSV file uploaded and processed successfully",
          data: csvData,
        });
      });
    });
};

export const search = async (req: Request, res: Response) => {
  const searchParams = req.query.q as string;

  let auxSearchParams = [] as string[];

  if (searchParams.search(" ") !== -1) {
    auxSearchParams.push(...searchParams.split(" "));
  }

  try {
    const data = await jsonHelper.readJsonFile(
      path.join(__dirname, "..", "..", "uploads", "data.json")
    );

    if (!searchParams) {
      return res.status(200).json({ data });
    }

    const filteredData: any[] = [];

    data.forEach((element: any) => {
      const values = (Object.values(element) as string[]).map((value: string) =>
        value.toLowerCase()
      );

      const keys = (Object.keys(element) as string[]).map((key: string) =>
        key.toLowerCase()
      );

      const entries = Object.entries(element).map((entry) => entry);

      entries.forEach((entry) => {
        if (
          entry.includes(searchParams) ||
          auxSearchParams.includes(`${entry[0]}:`) ||
          auxSearchParams.includes(entry[1] as string)
        ) {
          return filteredData.push(element);
        }
      });

      values.forEach((value) => {
        if (value.toLowerCase().search(searchParams.toLowerCase()) != -1) {
          return filteredData.push(element);
        }
      });

      keys.forEach((key) => {
        if (key.toLowerCase().search(searchParams.toLowerCase()) != -1) {
          return filteredData.push(element);
        }
      });
    });

    if (filteredData.length > 0) {
      return res.status(200).json({ data: removeRepitedObjects(filteredData) });
    }

    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Ops.. maybe we have some problems" });
  }
};

const csvController = {
  save,
  search,
};

export default csvController;
