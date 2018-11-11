import expect from 'expect';

export default function(plugin, change) {
    plugin.changes.mergeCellsHorizontallyAtRange(
        change,
        change.value.selection
    );
    // FIXME: add console.warn spy
    // expect(console.warn).toHaveBeenCalled();
    return change;
}
