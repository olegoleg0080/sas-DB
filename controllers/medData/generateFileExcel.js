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

    // Создание Excel-файла
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    // Заголовки
    worksheet.columns = Object.keys(students[0]._doc).map((key) => ({
        header: key,
        key,
        width: 15,
    }));

    // Добавление данных
    students.forEach((student) => {
        worksheet.addRow(student._doc);
    });

    // Создание временного файла
    const filePath = path.join("temp", `filtered_students_${Date.now()}.xlsx`);
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
