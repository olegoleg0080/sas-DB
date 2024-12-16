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

    // Группируем данные
    const groupedData = {};
    students.forEach((item) => {
        const classKey = `${item.parallel}-${item.class}`;
        if (!groupedData[classKey]) {
            groupedData[classKey] = [];
        }
        groupedData[classKey].push(item.name);
    });

    // Формируем данные для Excel
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

        // Добавляем строки в результат
        result.push([classKey1, classKey2 || ""]);
        for (let j = 0; j < maxLength; j++) {
            result.push([paddedNames1[j], paddedNames2[j]]);
        }
    }

    // Создание Excel-файла
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    result.forEach((row) => worksheet.addRow(row));
    worksheet.columns = [
        { header: "Class 1", key: "class1", width: 25 },
        { header: "Class 2", key: "class2", width: 25 },
    ];

    // Создание временного файла
    const filePath = path.join("temp", `filtered_data_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    // Отправка файла
    res.download(filePath, (err) => {
        // Удаление временного файла после отправки
        fs.unlinkSync(filePath);
        if (err) {
            throw HTTPError(500, "Error downloading the file");
        }
    });
};

export default generateFilteredExcel;
