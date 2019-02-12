$('#mountains-btn').click(function () {
    setActiveTool("mountains", $(this))
});

$('#rivers-btn').click(function () {
    setActiveTool("rivers", $(this))
});

$('#corrector-btn').click(function () {
    setActiveTool("corrector", $(this))
});

$('#eraser-btn').click(function () {
    setActiveTool("eraser", $(this))
});

let activeTool;

function setActiveTool(toolName, button) {
    activeTool = toolName;
    $('.tool-button').removeClass('selected');
    button.addClass('selected');
}

$('#rivers-btn').click();