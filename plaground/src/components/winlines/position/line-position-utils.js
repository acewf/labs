/**
 * Created by pedro.martins on 08/08/2016.
 */
export default class LinePositionUtils {
    static getLinePositions(matrix, layoutData) {
        let lines = [];
        for (let i = 0; i < matrix.length; i++) {
            let dataLine = [];
            let line = matrix[i];
            for (let r = 0; r < line.length; r++) {
                let indexRow = line[r];
                let data = this.getLinePosition(r, indexRow, layoutData);
                dataLine.push(data);
            }
            lines.push(dataLine);
        }
        return lines;
    }

    static  getLinePosition(indexColumn, indexRow, position) {
        let column = position.column[indexColumn];
        let Row = column["row"][indexRow];
        return {x: column.x, y: Row};
    }
}