import { Student } from "../../model/Student.js";
import { HTTPError } from "../../helpers/index.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const generateFilteredExcel = async (req, res) => {
    const { filterKey, filterValue } = req.params;

    // Шаг 1: Получаем данные с фильтрацией
    const students = await Student.find({ [filterKey]: filterValue });
    console.log(students);
    
    if (!students.length) {
        throw HTTPError(404, "No data found for the provided filter");
    }

    // Шаг 2: Группируем по параллели и классу
    const groupedData = {};
    students.forEach((item) => {
        const classKey = `${item.paralel}-${item.class}`;
        if (!groupedData[classKey]) {
            groupedData[classKey] = [];
        }
        groupedData[classKey].push(item.name);
    });

    // Шаг 3: Подготавливаем данные для Excel
    const result = [];
    const classKeys = Object.keys(groupedData);

    for (let i = 0; i < classKeys.length; i += 2) {
        const classKey1 = classKeys[i]; // Заголовок первой колонки
        const classKey2 = classKeys[i + 1]; // Заголовок второй колонки (если есть)

        const names1 = groupedData[classKey1] || [];
        const names2 = groupedData[classKey2] || [];

        const maxLength = Math.max(names1.length, names2.length);

        // Добавляем заголовки классов
        result.push([classKey1 || "", classKey2 || ""]);

        // Добавляем имена учеников
        for (let j = 0; j < maxLength; j++) {
            result.push([
                names1[j] || "", // Имя для первого класса
                names2[j] || ""  // Имя для второго класса
            ]);
        }
    }

    // Шаг 4: Создание Excel-файла
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    // Добавляем данные в лист
    result.forEach((row) => {
        worksheet.addRow(row);
    });

    // Устанавливаем ширину колонок
    worksheet.columns = [
        { width: 25 },
        { width: 25 },
    ];

    // Шаг 5: Создание временного файла
    const filePath = path.join("temp", `filtered_data_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    // Шаг 6: Отправка файла клиенту
    res.download(filePath, (err) => {
        fs.unlinkSync(filePath); // Удаление временного файла после скачивания
        if (err) {
            throw HTTPError(500, "Error downloading the file");
        }
    });
};

export default generateFilteredExcel;
