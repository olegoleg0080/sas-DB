import { Student } from "../../model/Student.js";
import { HTTPError } from "../../helpers/index.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const generateFilteredExcel = async (req, res) => {
    const { filterKey, filterValue } = req.params;

    // Получение данных с фильтрацией
    const students = await Student.find({ [filterKey]: filterValue });
    if (!students.length) {
        throw HTTPError(404, "No data found for the provided filter");
    }

    // Шаг 1: Группируем данные по параллели и классу
    const groupedData = {};
    students.forEach((item) => {
        const classKey = `${item.parallel}-${item.class}`;
        if (!groupedData[classKey]) {
            groupedData[classKey] = [];
        }
        groupedData[classKey].push(item.name);
    });

    // Шаг 2: Подготавливаем данные для Excel в две колонки
    const result = [];
    const classKeys = Object.keys(groupedData);

    for (let i = 0; i < classKeys.length; i += 2) {
        const classKey1 = classKeys[i];
        const classKey2 = classKeys[i + 1];

        const names1 = groupedData[classKey1] || [];
        const names2 = groupedData[classKey2] || [];

        const maxLength = Math.max(names1.length, names2.length);

        // Добавляем заголовок классов
        result.push([classKey1 || "", classKey2 || ""]);

        // Заполняем имена учеников для обоих классов
        for (let j = 0; j < maxLength; j++) {
            const name1 = names1[j] || "";
            const name2 = names2[j] || "";
            result.push([name1, name2]);
        }
    }

    // Шаг 3: Создание Excel-файла
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    // Устанавливаем ширину колонок и добавляем строки
    worksheet.columns = [
        { header: "Class 1", key: "class1", width: 25 },
        { header: "Class 2", key: "class2", width: 25 },
    ];

    result.forEach((row) => {
        worksheet.addRow(row);
    });

    // Шаг 4: Создание временного файла
    const filePath = path.join("temp", `filtered_data_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    // Шаг 5: Отправка файла клиенту
    res.download(filePath, (err) => {
        fs.unlinkSync(filePath); // Удаление файла после скачивания
        if (err) {
            throw HTTPError(500, "Error downloading the file");
        }
    });
};

export default generateFilteredExcel;
