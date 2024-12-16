import { Student } from "../../model/Student.js";  // Импорт модели для работы с MongoDB
import { HTTPError } from "../../helpers/index.js";  // Ошибки для обработки
import ExcelJS from "exceljs";  // Модуль для работы с Excel
import fs from "fs";  // Модуль для работы с файловой системой
import path from "path";  // Модуль для работы с путями

const generateFilteredExcel = async (req, res) => {
    const { filterKey, filterValue } = req.params;  // Получаем фильтр из параметров запроса

    // Получаем данные с фильтрацией из MongoDB
    const students = await Student.find({ [filterKey]: filterValue });
    console.log("students:", students);
    
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

        result.push([classKey1 || "", classKey2 || ""]);

        for (let j = 0; j < maxLength; j++) {
            result.push([names1[j] || "", names2[j] || ""]);
        }
    }

    // Шаг 3: Создание Excel-файла
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    worksheet.columns = [
        { key: "class1", width: 25 },
        { key: "class2", width: 25 },
    ];

    result.forEach((row) => {
        worksheet.addRow(row);
    });

    // Указываем путь для папки temp
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // Указываем путь для файла
    const filePath = path.join(tempDir, `filtered_data_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    // Шаг 4: Отправка файла клиенту
    res.download(filePath, (err) => {
        if (err) {
            throw HTTPError(500, "Error downloading the file");
        }

        // Удаляем файл после отправки
        fs.unlinkSync(filePath);
    });
};

export default generateFilteredExcel;
