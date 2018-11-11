export default function(plugin, change) {
    plugin.changes.mergeCellsHorizontallyAtRange(
        change,
        change.value.selection
    );

    return change;
}
