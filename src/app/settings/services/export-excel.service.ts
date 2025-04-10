import { Injectable } from '@angular/core';
// import * as Excel from 'exceljs';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  // workbook;

  constructor() {}

  blobType: string =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  excels(
    data: any,
    excelname,
    key,
    col,
    title,
    headerNum,
    numLopp,
    imgSize,
    x,
    column_align = [],
    colocarResumoAbaixo: boolean = false,
    filtros = [],
  ) {
    var footer = ['ENCONTRAR'];
    var localDate = JSON.parse(localStorage.getItem('accessToken'));
    var workbook = new Excel.Workbook();
    workbook.creator = 'Web';
    workbook.lastModifiedBy = 'Web';
    workbook.created = new Date();
    workbook.modified = new Date();

    workbook.addWorksheet(title, {
      views: [
        {
          state: 'frozen',
          ySplit: filtros.length > 0 ? 15 : 5,
          xSplit: x,
          activeCell: 'C2',
          showGridLines: true,
        },
      ],
    });
    var sheet = workbook.getWorksheet(1);

    if (sheet) {
      sheet.getCell('G2').value = moment(new Date()).format(
        'DD-MM-YYYY HH:mm:ss',
      );
      sheet.getCell('G1').value = localDate.user.name;
      sheet.getCell('B3').value = title;

      if (filtros.length > 0) {
        var contCell = 8;
        sheet.getCell('A6').value = 'FILTRAGEM POR:';
        for (
          let indexFiltros = 0;
          indexFiltros < filtros.length;
          indexFiltros++
        ) {
          sheet.getCell('A' + contCell).value = filtros[indexFiltros].name
            .replace(/_/g, ' ')
            .toUpperCase();
          sheet.getCell('B' + contCell).value = filtros[indexFiltros].value;
          contCell++;
        }
      }

      //sheet.getCell('A1').value = " "
      /*  sheet.getCell('A2').value = " "
      sheet.getCell('A3').value = " "

      sheet.getCell('A4').value = " "
      sheet.getCell('D2').value = " "
      if(x>=5){
        sheet.mergeCells('B3','E3')
      }else{
        sheet.mergeCells('B3','C3')
      }
      */
      /*
      sheet.addBackgroundImage(imageId1); */
      sheet.addRow('');
      sheet.getRow(filtros.length > 0 ? 15 : 5).values = col;
      sheet.columns = key;
      sheet.getRow(filtros.length > 0 ? 15 : 5).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' },
        size: 13,
      };

      /* sheet.getRow(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' },
        size: 26
      } */

      sheet.addRows(data);

      sheet.addRow('').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' },
        size: 20,
      };

      sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell(function (cell, colNumber) {
          cell.font = {
            name: 'Arial',
            family: 2,
            bold: true,
            size: 20,
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          if (rowNumber < headerNum) {
            for (var i = 0; i < headerNum; i++) {
              sheet.getRow(i).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
                size: 20,
              };
            }
          }

          if (rowNumber <= headerNum + 1) {
            row.height = 20;
            cell.font = {
              bold: true,
              size: 20,
              color: { argb: '000000' },
            };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
          }

          if (rowNumber >= headerNum) {
            for (var i = 1; i < numLopp + 1; i++) {
              if (rowNumber < headerNum) {
                cell.font = {
                  color: { argb: '000000' },
                  bold: true,
                  size: 14,
                };
                row.height = 25;
                row.getCell(i).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'ffffff' },
                };

                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                };
              }
              if (rowNumber == headerNum && rowNumber < headerNum + 1) {
                cell.font = {
                  color: { argb: 'ffffff' },
                  bold: true,
                  size: 14,
                };
                row.height = 25;
                row.getCell(i).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'ebad1e' },
                };

                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                };
              } else {
                row.getCell(i).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'ffffff' },
                };

                cell.font = {
                  color: { argb: '2e2e2f' },
                  bold: false,
                  size: 12,
                };
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                };
              }

              row.getCell(i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              };
            }
          }

          if (rowNumber >= 6) {
            column_align.map((key) => {
              row.getCell(key).alignment = {
                vertical: 'middle',
                horizontal: 'right',
                color: { argb: 'FFFF6600' },
              };
            });
          }
        });
      });

      if (sheet.name == 'MOVIMENTOS DE CAIXA') {
        const linhaTotais = headerNum + data.length;
        const letrasTituloTotais = [
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
        ];
        for (let cadaT of letrasTituloTotais) {
          sheet.getCell(cadaT + linhaTotais).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'efefef' },
            size: 13,
          };
          sheet.getCell(cadaT + linhaTotais).font = {
            bold: true,
            size: 12,
            color: { argb: '000000' },
          };
        }
      }

      //resumo abaixo
      if (colocarResumoAbaixo) {
        const linhaResumo = headerNum + data.length + 5;
        const totalCarteiraResumo = 'C';
        const totalDividaCarteiraResumo = 'E';
        const totalDividaBonus = 'I';
        const totalBonus = 'G';

        // --------------------------------------------

        const valorTotalCarteiraResumo = 'D';
        const valorTotalDividaCarteiraResumo = 'F';
        const valorTotalBonus = 'H';
        const valorTotalDividaBonus = 'J';

        const rowResumo = sheet.getRow(linhaResumo);
        rowResumo.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ffffff' },
          size: 13,
        };

        const tamanhoTitulo = 20;
        const letrasTituloResumo = ['C', 'E', 'G', 'I'];
        for (let cadaT of letrasTituloResumo) {
          sheet.getCell(cadaT + linhaResumo).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ff0000' },
            size: 13,
          };
          sheet.getCell(cadaT + linhaResumo).font = {
            bold: true,
            size: tamanhoTitulo,
            color: { argb: 'ffffff' },
          };

          sheet.getCell(cadaT + linhaResumo).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }

        const tamanhoValor = 20;
        const letrasValorResumo = ['D', 'F', 'H', 'J'];
        for (let cadaT of letrasValorResumo) {
          sheet.getCell(cadaT + linhaResumo).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffffff' },
            size: 13,
          };
          sheet.getCell(cadaT + linhaResumo).font = {
            bold: true,
            size: tamanhoValor,
            color: { argb: '000000' },
          };

          sheet.getCell(cadaT + linhaResumo).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }
        sheet.getCell(totalCarteiraResumo + linhaResumo).value =
          'TOTAL CARTEIRA :';

        sheet.getCell(valorTotalCarteiraResumo + linhaResumo).value = 0;

        sheet.getCell(totalDividaCarteiraResumo + linhaResumo).value =
          'TOTAL DIVIDA CARTEIRA :';

        sheet.getCell(valorTotalDividaCarteiraResumo + linhaResumo).value = 0;
      }
    }

    workbook.xlsx.writeBuffer().then((Data) => {
      var blob = new Blob([Data], { type: this.blobType });

      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = excelname;
      a.click();
    });
  }
}
