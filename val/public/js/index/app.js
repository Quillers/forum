const form = document.getElementById('message-form');


const formSubmitHandler = function(e) {
    e.preventDefault();
    const msg = e.target[0].value;
    const pseudo = e.target[1].value;
    e.target[1].value = "";
    e.target[0].value = "";
    console.log(msg, pseudo);
    list.addMessage(new MessageItem(new Message(msg, pseudo)));
    list.render();

}

form.addEventListener('submit', formSubmitHandler);


class Message {
    constructor(content, username) {
        this.content = content;
        this.username = username;
    }

}

class MessageItem{
    constructor(message) {
        this.message = message;
    }
    render() {
        const messageElem = document.createElement('article');
        messageElem.classList.add('message');
            const header = document.createElement('header');
            header.classList.add('message__header');
                const h3 = document.createElement('h3');
                h3.classList.add('message__author');
                h3.textContent = this.message.username;
            header.appendChild(h3);
            messageElem.appendChild(header);
            const section = document.createElement('section');
            section.classList.add('message__main');
            section.textContent = this.message.content;
            messageElem.appendChild(section);
            const footer = document.createElement('footer');
            footer.classList.add('message__footer');
                const p = document.createElement('p');
                p.textContent = `publie le ${(new Date()).toISOString()}`
                footer.appendChild(p);
            messageElem.appendChild(footer);
        return messageElem;
    }
    
}

class MessageList {
    messageList = [];

     addMessage(messageItem) {
        this.messageList.push(messageItem);
    }
    render() {
        const messageBox = document.getElementById('message-list');
        messageBox.textContent = "";
        this.messageList.forEach((messageItem) => {
            messageBox.appendChild(messageItem.render());
        })

    };
}

const list = new MessageList();