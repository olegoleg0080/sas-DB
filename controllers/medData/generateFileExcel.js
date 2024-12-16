import { Student } from "../../model/Student.js";
import { HTTPError } from "../../helpers/index.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const generateFilteredExcel = async (req, res) => {
    const { filterKey, filterValue } = req.params;

    // Шаг 1: Получаем данные с фильтрацией
    const students = await Student.find({ [filterKey]: filterValue });
    if (!students.length) {
        throw HTTPError(404, "No data found for the provided filter");
    }

    // Шаг 2: Группируем по параллели и классу
    const groupedData = {};
    students.forEach((item) => {
        const classKey = `${item.parallel}-${item.class}`;
        if (!groupedData[classKey]) {
            groupedData[classKey] = [];
        }
        groupedData[classKey].push(item.name);
    });

    // Шаг 3: Преобразуем данные в формат для Excel
    const result = [];
    const classKeys = Object.keys(groupedData);

    for (let i = 0; i < classKeys.length; i += 2) {
        const classKey1 = classKeys[i];
        const classKey2 = classKeys[i + 1];

        const names1 = groupedData[classKey1] || [];
        const names2 = groupedData[classKey2] || [];

        const maxLength = Math.max(names1.length, names2.length);

        // Заполняем массивы имен до одинаковой длины
        const paddedNames1 = [...names1, ...Array(maxLength - names1.length).fill("")];
        const paddedNames2 = [...names2, ...Array(maxLength - names2.length).fill("")];

        // Добавляем заголовок классов
        result.push([classKey1 || "", classKey2 || ""]);

        // Добавляем строки с именами
        for (let j = 0; j < maxLength; j++) {
            result.push([paddedNames1[j], paddedNames2[j]]);
        }
    }

    // Шаг 4: Создаем Excel-файл
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    worksheet.columns = [
        { header: "Class 1", key: "class1", width: 25 },
        { header: "Class 2", key: "class2", width: 25 },
    ];

    // Добавляем данные в Excel
    result.forEach((row) => {
        worksheet.addRow(row);
    });

    // Шаг 5: Создаем временный файл
    const filePath = path.join("temp", `filtered_data_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    // Шаг 6: Отправляем файл клиенту
    res.download(filePath, (err) => {
        fs.unlinkSync(filePath); // Удаляем временный файл
        if (err) {
            throw HTTPError(500, "Error downloading the file");
        }
    });
};

export default generateFilteredExcel;
