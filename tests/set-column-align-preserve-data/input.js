/** @jsx hyperscript */
import hyperscript from '../hyperscript';

export default (
    <document>
        <table custom="state" presetAlign={['left', 'left']}>
            <table_row>
                <table_cell>Col 0, Row 0</table_cell>
                <table_cell>Col 1, Row 0</table_cell>
            </table_row>
            <table_row>
                <table_cell key="_cursor_1">Col 0, Row 1</table_cell>
                <table_cell key="_cursor_2">Col 1, Row 1</table_cell>
            </table_row>
            <table_row>
                <table_cell>Col 0, Row 2</table_cell>
                <table_cell>Col 1, Row 2</table_cell>
            </table_row>
        </table>
    </document>
);