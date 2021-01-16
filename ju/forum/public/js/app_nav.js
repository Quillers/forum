import { Topic } from './class/Topic.js'

const topic = new Topic()

document.addEventListener('DOMContentLoaded', () => {
  topic.createTopicName()
  topic.createAllMessagesContainer()
  topic.createForm()
})
