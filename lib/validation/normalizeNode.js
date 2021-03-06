// @flow

import type Options from '../options';
import { createCell } from '../utils';

/*
 * Ensure each row has the same number of columns.
 */
function normalizeNode(opts: Options) {
    const isRow = node => node.type === opts.typeRow;
    const isCell = node => node.type === opts.typeCell;
    const countCells = row => {
        const counts = row.nodes.map(
            node => (isCell(node) ? node.data.get('colSpan', 1) : 0)
        );
        return counts.reduce((acc, c) => acc + c, 0);
    };

    return node => {
        if (node.type !== opts.typeTable) {
            return undefined;
        }

        const rows = node.nodes.filter(isRow);
        const maxColumns = Math.max(
            // Minimum 1 column
            1,
            rows.map(countCells).max()
        );

        const rowsMissingColumns = rows.filter(
            row => countCells(row) < maxColumns
        );

        if (rowsMissingColumns.isEmpty()) {
            return undefined;
        }

        return change => {
            change.withoutNormalizing(() => {
                rowsMissingColumns.forEach(row => {
                    const numberOfCellsToAdd = maxColumns - row.nodes.size;
                    const cells = Array.from({
                        length: numberOfCellsToAdd
                    }).map(() => createCell(opts));
                    cells.forEach(cell =>
                        change.insertNodeByKey(row.key, row.nodes.size, cell)
                    );
                });
            });
        };
    };
}

export default normalizeNode;
