
// EXPORTS
let activeTool;

const data = {
    tools: [{
            name: 'mountains',
            title: 'Mountains',
            src: 'https://cdn3.iconfinder.com/data/icons/pyconic-icons-1-2/512/mountain-512.png'
        },
        {
            name: 'rivers',
            title: 'Rivers',
            src: 'https://cdn0.iconfinder.com/data/icons/energy-and-power-3/512/131-512.png'
        },
        {
            name: 'corrector',
            title: 'Corrector',
            src: 'https://static.thenounproject.com/png/62595-200.png'
        },
        {
            name: 'eraser',
            title: 'Eraser',
            src: 'https://cdn3.iconfinder.com/data/icons/text/100/eraser-512.png'
        }
    ],
    setActiveTool: function (tool) {
        data.tools.forEach(e => e.isActive = false);
        tool.isActive = true;
        activeTool = tool.name;
    }
}

data.setActiveTool(data.tools[1]);

const app = new Vue({
    el: "#container",
    data
})
