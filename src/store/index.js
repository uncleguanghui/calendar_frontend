import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [
      { title: "event 8.1 event event ", date: "2020-03-20" },
      { title: "event 8.1 event event ", date: "2020-04-20" },
      {
        title: "event 8.1 event event ",
        start: "2020-04-20 16:00:00",
        end: "2020-04-21 09:30:10"
      },
      {
        title: "event 8.1 event event ",
        start: "2020-04-20 18:00:00"
      },
      {
        title: "event 9.1 event event ",
        date: "2020-04-20",
        extendedProps: {
          status: "done"
        },
        backgroundColor: "#00bcbc"
      },
      { title: "event 1.1 event event ", date: "2020-04-21" },
      { title: "event 1.2 event event ", date: "2020-04-21" },
      { title: "event 1.3 event event ", date: "2020-04-21" },
      { title: "event 1.4 event event ", date: "2020-04-21" },
      { title: "event 1.5 event event ", date: "2020-04-21" },
      { title: "event 2.1 event event ", date: "2020-04-22" },
      {
        title: "event 2.2 event event ",
        start: "2020-04-22",
        end: "2020-04-22"
      },
      {
        title: "event 2.3 event event ",
        start: "2020-04-22",
        end: "2020-04-29",
        color: "#06BB87"
      }
    ],
    books: [
      { title: "私有日历本", bookId: "self" },
      { title: "团队日历本", bookId: "team" }
    ]
  },
  mutations: {},
  actions: {},
  modules: {}
});
