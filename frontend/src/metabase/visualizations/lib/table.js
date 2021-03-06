/* @flow */

import type { DatasetData } from "metabase/meta/types/Dataset";
import type { ClickObject } from "metabase/meta/types/Visualization";

export function getTableCellClickedObject(data: DatasetData, rowIndex: number, columnIndex: number, isPivoted: boolean): ClickObject {
    const { rows, cols } = data;

    const column = cols[columnIndex];
    const row = rows[rowIndex];
    const value = row[columnIndex];

    if (isPivoted) {
        // if it's a pivot table, the first column is
        if (columnIndex === 0) {
            // $FlowFixMe: _dimension
            return row._dimension;
        } else {
            return {
                value,
                column,
                // $FlowFixMe: _dimension
                dimensions: [row._dimension, column._dimension]
            };
        }
    } else if (column.source === "aggregation") {
        return {
            value,
            column,
            dimensions: cols
                .map((column, index) => ({ value: row[index], column }))
                .filter(dimension => dimension.column.source === "breakout")
        };
    } else {
        return { value, column };
    }
}
