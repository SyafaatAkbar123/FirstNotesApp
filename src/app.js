import { notesData } from "./data.js";

class MyAppBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <h1>My Notes App</h1>
            </header>
        `;
    }
}

class MyFooterBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <h3>Syafaat Akbar F1316YB262 &copy; 2024</h3>
            </footer>
        `
    }
}

class MyNoteForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <form id="my-note-form">
            <h2>Form Tambahkan Note Baru</h2>
                <input type="text" id="note-title" placeholder="Masukkan Judul" required>
                <textarea id="note-body" placeholder="Masukkan Isi Notes" required></textarea>
                <button type="submit">Tambah Note</button>
            </form>
        `;

        const myForm = this.querySelector('#my-note-form');
        myForm.addEventListener('input', this.validateMyForm.bind(this));
        myForm.addEventListener('submit', this.addMyNotes.bind(this));
    }

    validateMyForm(event) {
        const inputTitle = this.querySelector('#note-title');
        const inputBody = this.querySelector('#note-body');
        const buttonSubmit = this.querySelector('button[typer="submit"]');

        if(inputTitle.validity.valid && inputBody.validity.valid) {
            buttonSubmit.removeAttribute('disabled')
        } else {
            buttonSubmit.setAttribute('disabled', true);
        }
    }

    addMyNotes(event) {
        event.preventDefault();
        const title = this.querySelector('#note-title').value;
        const body = this.querySelector('#note-body').value;

        if(title && body) {
            const myNewNote = {
                id: `note-${Date.now()}`,
                title,
                body,
                createdAt: new Date().toISOString(),
                archived: false
            };
            notesData.push(myNewNote);

            document.dispatchEvent(new CustomEvent('noteSuccAdded', { detail: myNewNote }));
            event.target.reset();
        }
    }
}

class MyNoteList extends HTMLElement {
    connectedCallback() {
        this.render();

        document.addEventListener('noteSuccAdded', this.render.bind(this));
    }

    render() {
        this.innerHTML = `
            <section id="my-note-list"></section>
        `;

        const myNoteList = this.querySelector('#my-note-list');
        notesData.forEach(note => {
            const myNoteItem = document.createElement('my-note-item');
            myNoteItem.note = note;
            myNoteList.appendChild(myNoteItem);
        });
    }
}

class MyNoteItem extends HTMLElement {
    set note(note) {
        this.setAttribute('data-note-type', 'note');
        this.innerHTML = `
            <article>
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <small>Created at: ${new Date(note.createdAt).toLocaleString()}</small>
            </article>
        `;
    }
}

customElements.define('my-app-bar', MyAppBar);
customElements.define('my-note-form', MyNoteForm);
customElements.define('my-note-item', MyNoteItem);
customElements.define('my-note-list', MyNoteList);
customElements.define('my-footer-bar', MyFooterBar);