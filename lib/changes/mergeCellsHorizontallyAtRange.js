// @flow
import { type Change } from 'slate';
import { TablePosition } from '../utils';
import type Options from '../options';

// FIXME: put this somewhere useful
function unique(iterable, getter = x => x) {
    const seen = [];
    return iterable.filter(x => {
        const id = getter(x);
        if (seen.indexOf(id) === -1) {
            seen.push(id);
            return true;
        }
    });
}
/**
 * Insert a new column in current table
 */
function mergeCellsHorizontallyAtRange(
    opts: Options,
    change: Change,
    range: Range
): Change {
    const { value } = change;
    const startPosition = TablePosition.create(
        opts,
        value.document,
        range.start.key
    );
    const startCell = startPosition.cell;
    const endPosition = TablePosition.create(
        opts,
        value.document,
        range.focus.key
    );
    if (startPosition.row !== endPosition.row) {
        console.warn('Cells are not in the same row');
        return change;
    }
    const endCell = endPosition.cellBlock;
    const row = startPosition.row;
    const startIndex = row.nodes.indexOf(startCell);
    const endIndex = row.nodes.indexOf(endCell);
    const cells = row.nodes.slice(startIndex, endIndex + 1);
    if (unique(cells.map(c => c.data.get('rowspan', 1))).size !== 1) {
        console.warn('Cells do not have the same rowspan');
        return change;
    }
    const colSpan = cells.reduce(
        (count, cell) => cell.data.get('colspan', 1) + count,
        0
    );
    change.withoutNormalizing(() => {
        change.setNodeByKey(startCell.key, {
            data: startCell.data.merge({ colSpan })
        });
        let contentIndex = startCell.nodes.size;
        cells.slice(1).forEach(cell => {
            cell.nodes.forEach(node => {
                change.moveNodeByKey(node.key, startCell.key, contentIndex);
                contentIndex += 1;
            });
            change.removeNodeByKey(cell.key);
        });
    });
    return change;
}

export default mergeCellsHorizontallyAtRange;
