const { Component, mount, xml, useRef, onMounted, useState, reactive, useEnv } = owl;

// Task Component
class Task extends Component {
    static template = xml /*xml*/`
    <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
      <input type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="toggleTask"/>
      <span><t t-esc="props.task.text"/></span>
      <span class="delete" t-on-click="deleteTask">X</span>
    </div>`;
    static props = ["task", "onDelete"];

    toggleTask() {
        this.props.task.isCompleted = !this.props.task.isCompleted;
    }

    deleteTask() {
        this.props.onDelete(this.props.task);
    }
};

class Root extends Component {
    static template = xml /* xml */`
    <div class="todo-app">
        <input placeholder="Enter a new task" t-ref="add-input" t-on-keyup="addTask" />
        <div class="task-list">
            <t t-foreach="tasks" t-as="task" t-key="task.id">
                <Task task="task" onDelete.bind="deleteTask"/>
            </t>
        </div>
    </div>

    `;
    static components = { Task };
    /*tasks = [
        {id: 1, text: "Hai Yn", isCompleted: true},
        {id: 2, text: "Free comic", isCompleted: false},
    ];*/

    nextId = 1;
    tasks = [];

    addTask(ev) {
        //13 is key for Enter
        if (ev.keyCode == 13) {
            const text = ev.target.value.trim();
            ev.target.value = "";
            console.log('adding task', text);
            // todo
            if (text) {
                const newTask = {
                    id: this.nextId++,
                    text: text,
                    isCompleted: false,
                };
                this.tasks.push(newTask);
            }
        }
    };

    setup() {
        const inputRef = useRef("add-input");
        onMounted(() => inputRef.el.focus());
    }

    //replace the task definition in App with the following
    tasks = useState([]);

    // Delete tasks
    deleteTask(task) {
        const index = this.tasks.findIndex(t => t.id == task.id);
        this.tasks.splice(index, 1);
    }
};

mount(Root, document.body, {dev: true});