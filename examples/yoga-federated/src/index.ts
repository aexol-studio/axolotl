import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';
import directives from './directives.js';

// This is yoga specific

adapter(
  { resolvers, directives },
  {
    yoga: {
      graphiql: {
        defaultQuery: `query MyTodos{
  user{
    todos{
      _id
      content
      done
    }
  }
}

mutation CreateTodo{
  user{
    createTodo(content: "hello")
  }
}

mutation Done{
  user{
    todoOps(_id: "0.12217321412133557"){
      markDone
    }
  }
}

mutation Register{
  register(username: "user",password: "password")
}`,
      },
    },
  },
).server.listen(4002, () => {
  console.log('LISTENING to ' + 4002);
});
