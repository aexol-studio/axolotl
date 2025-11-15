Implement the resolvers function for axolotl core that is specified here:

When you encounter @resolver directive inside schema please generate resolver objects for them

@resolver - used to mark fields that will have resolvers generated for them. For example:
```graphql
type Query {
    getAllBooks: [Book!]! @resolver
    favoriteBooks: [Book!]! @resolver
}

type Book {
    id: ID!
    title: String!
    relatedBooks: [Book!]! @resolver
}
```

For this resolvers there should be  objects generated:

```json
{
    "files":[
        {
            "name": "resolvers/Query/getAllBooks.ts",
            "content": "import {createResolvers} from '../../axolotl.js';\n export default createResolvers({ Query:{ getAllBooks: async([parent, details, ctx], args) => {\n\t\t// implement code here\n } } })"
        },
        {
            "name": "resolvers/Query/favoriteBooks.ts",
            "content": "import {createResolvers} from '../../axolotl.js';\n export default createResolvers({ Query:{ favoriteBooks: async([parent, details, ctx], args) => {\n\t\t// implement code here\n } } })"
        },
        {
            "name": "resolvers/Query/resolvers.ts",
            "replace": true,
            "content": "import {createResolvers} from '../../axolotl.js';\nimport getAllBooks from './getAllBooks.js';\nimport favoriteBooks from './favoriteBooks.js';\n export default createResolvers({ Query:{ ...getAllBooks.Query,...favoriteBooks.Query }})"
        },
        {
            "name": "resolvers/Book/relatedBooks.ts",
            "content": "import {createResolvers} from '../../axolotl.js';\n export default createResolvers({ Book:{ relatedBooks: async([parent, details, ctx], args) => {\n\t\t// implement code here\n } } })"
        },
        {
            "name": "resolvers/Book/resolvers.ts",
            "replace": true,
            "content": "import {createResolvers} from '../../axolotl.js';\nimport relatedBooks from './relatedBooks.js';\n export default createResolvers({ Book:{ ...relatedBooks.Book } })"
        },
        {
            "name": "resolvers/resolvers.ts",
            "replace": true,
            "content": "import {createResolvers} from '../axolotl.js';\n import Query from './Query/resolvers.js';\n import Book from './Book/resolvers.js';\n export default createResolvers({...Query, ...Book}) "
        }
    ]
}
```

