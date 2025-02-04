import { Student } from "../../model/Student.js";
import { HTTPError } from "../../helpers/index.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const groupMapping = {
    group1: "Основна",
    group2: "Підготовча",
    group3: "Спеціальна",
    group4: "Звільнений",
};

const generateFilteredExcel = async (req, res) => {
    const { filterKey = "All", filterValue = "All", specificClass = "All" } = req.params;

    let students;
    if (filterKey === "All" || filterValue === "All") {
        students = await Student.find();
    } else {
        students = await Student.find({ [filterKey]: filterValue });
    }

    students = students.map(student => ({
        ...student.toObject(),
        _id: student._id.toString(),
    }));

    if (!students.length) {
        throw HTTPError(404, "No data found for the provided filter");
    }

    if (specificClass !== "All") {
        const [parallel, className] = specificClass.split("-");
        students = students.filter(student =>
            String(student.parallel) === parallel && student.class === className
        );
    }

    if (!students.length) {
        throw HTTPError(404, "No data found for the specified class");
    }

    const groupedData = {};
    students.forEach(item => {
        const classKey = `${item.parallel}-${item.class}`;
        if (!groupedData[classKey]) {
            groupedData[classKey] = [];
        }
        groupedData[classKey].push(item.name);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    const headerText = filterKey === "group" ? `Група з фізкультури: ${groupMapping[filterValue] || "Невідомо"}` :
        filterKey === "vac" ? (filterValue === "yes" ? "Усі необхідні щеплення наявні" : "Необхідні щеплення відсутні") : "";

    worksheet.mergeCells("A1:D1");
    worksheet.getCell("A1").value = headerText;
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A1").font = { bold: true };

    worksheet.addRow(["", "ПІБ учня", "", "ПІБ учня"]);
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).alignment = { horizontal: "center", vertical: "middle" };

    const classKeys = Object.keys(groupedData);
    classKeys.forEach(classKey => {
        const names = groupedData[classKey] || [];
        worksheet.addRow([classKey, "", classKey, ""]).font = { bold: true };
        names.forEach((name, index) => {
            const row = worksheet.addRow([index + 1, name, index + 1, names[index + 1] || ""]);
            row.height = 30;
            row.alignment = { vertical: "middle" };
        });
    });

    worksheet.columns = [
        { key: "number1", width: 4 },
        { key: "name1", width: 39 },
        { key: "number2", width: 4 },
        { key: "name2", width: 39 },
    ];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 2) {
            row.eachCell((cell, colNumber) => {
                cell.alignment = { wrapText: true, vertical: "middle" };
                if (colNumber % 2 === 1) {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FF000000' } },
                        bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    };
                } else {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FF000000' } },
                        left: { style: 'thin', color: { argb: 'FF000000' } },
                        bottom: { style: 'thin', color: { argb: 'FF000000' } },
                        right: { style: 'thin', color: { argb: 'FF000000' } },
                    };
                }
            });
        }
    });

    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, `filtered_data_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, err => {
        if (err) {
            throw HTTPError(500, "Error downloading the file");
        }
        fs.unlinkSync(filePath);
    });
};

export default generateFilteredExcel;