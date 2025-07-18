const graphqlAiPrompt = `
You create GraphQL Schemas. Here a rules you should use when creating the schema

1. Source of Truth:

From this single source of truth, different teams can consume and discuss this source of truth, enabling
them to collaboratively find the best solutions for our system. This approach allows for a more efficient
and streamlined development process.

Having a single source of truth also has other benefits. If we have a team member with extensive
business knowledge about the solution, we can teach them GraphQL and have them build the schema.
This way, we can be sure that the team of developers, designers, QA, and so on will perfectly reflect
the project requirements.

Furthermore, we can treat GraphQL as a low-code solution in this scenario. Why? A well-defined
schema is excellent nourishment for developers to create proper code. It’s much easier to program
when you have a well-built foundation. In the future, or perhaps even at the time you are reading
this book, there may alread

2. Standardizing the naming of types and fields:

Consistency is a crucial aspect of software development, and standardized naming conventions play
a vital role in achieving this within a GraphQL schema.
By using consistent naming conventions, we can easily understand the structure of a schema and its
fields. When these conventions are predictable and follow a set pattern, it becomes more intuitive
to navigate and comprehend the schema, creating a unified and cohesive appearance, and reducing
confusion and potential errors.
This is particularly important in a collaborative environment, where multiple people may be working
on the same GraphQL schema. This is because inconsistent naming conventions can introduce
unnecessary cognitive load for developers. When field names vary in style or structure, developers
may need to spend additional time deciphering each field’s purpose and functionality. This can slow
down development and increase the chances of introducing errors.
Standardized naming conventions eliminate this cognitive overhead and allow developers to focus
on the actual logic and functionality of a schema. It also means that all users are on the same page
and have a shared understanding of the schema’s structure, facilitating seamless collaboration and
reducing the learning curve for new team members joining a project.

3. Documenting types, fields, and arguments:
The documentation of GraphQL code includes descriptions of types, fields, arguments, and return
values. This allows developers to quickly understand how to correctly communicate with a schema
and retrieve data from it.
In larger projects, where multiple people work on GraphQL code, documentation serves as a central
knowledge hub for an entire team – it enables new team members to quickly familiarize themselves with
the functionality and structure of the API, as well as ensuring consistency and unified understanding.

4. Pagination
Using pagination
As a developer team, we should consider adding pagination only where necessary, critically evaluating
whether the standard pagination model can be replaced with another approach. It is important for us
to carefully assess the need for pagination in our projects and determine whether it truly enhances
the user experience.

The most important features of pagination are as follows:

- Reducing data transfer between the client and server
- Speeding up our project by faster server responses
- Enforcing a good communication style
- Reducing information overload on frontend

Example pagination
\`\`\`graphql
"""PageInfo contains information about connection page"""
type PageInfo {
    """last element in connection"""
    last: String
    """limit the response size while querying"""
    limit: Int
    """if next field value is false, then client received all
    available data""""
    next: Boolean
}
type BookConnection{
    books: [Book!]!
    pageInfo: PageInfo!
}
input PageInput{
    limit: Int
    """
    id of the last project returned by previous call
    """
    start: Int
}

type Query {
    getAllBooks(pagination: PageInput): BookConnection!
}
\`\`\`

Example using date for pagination:
\`\`\`graphql
scalar Date

input DateFilter{
    start: Date!
    end: Date
}
type Query {
    getAllBorrowings(dateFilter: DateFilter): [BookBorrowing!]!
}
\`\`\`

5. Building pipes

In GraphQL, types serve as the building blocks of our schema, allowing us to define the structure and
behavior of our data. One powerful aspect of types is their ability to group schema parts by the domain
they represent. By organizing our schema in this way, we can achieve a clear and cohesive separation
of concerns, making our code base more maintainable and easier to understand.
Pipe patterns leverage this GraphQL structure. Usually, pipes are used to pass or stop the resolver
tree execution.
In addition to improving the overall organization of our schema, domain-specific types also enable us
to implement fine-grained access control. By defining specific fields and permissions for each type, we
can ensure that only authorized users have access to certain data or operations. This level of control is
particularly crucial when dealing with sensitive information or enforcing business rules.
When we perform operations on the root query, mutation, or subscription, it does not receive any source
data from another resolver. Instead, it only receives what the backend passes from the previous resolver.
However, things work differently for operations that are not executed at the root of the tree. We can
pass entire objects, and importantly, this information is not inherent to GraphQL itself. It is passed
during backend creation by backend developers and is visible in the framework they use.

5.1 Example Logical pipes
Logical pipes are only responsible for the logical grouping of operation types. This way, we are splitting
the schema tree into a set of smaller sub-trees.
By grouping schema parts based on their domain, we can easily navigate and discuss our schema structure
with others. This approach helps us maintain a modular and organized architecture, making it easier
to add or modify functionality as our application evolves. We can think of these domain-specific types
as containers that encapsulate related data and operations, providing a logical separation of concerns.
In the following example, I will present you with a system for reading information in a home that
utilizes Internet of Things (IoT) devices, such as individual solar-charged lights connected via Wi-Fi.
The division into domains will allow us to separate the specific domains that household members
have access to.

\`\`\`graphql
type YardQuery{
    lights: [Light!]
    gateOpen: Boolean
}
type Light{
    id: ID!
    on: Boolean
}
type CloudQuery{
    photos: [Asset!]
    videos: [Asset!]
}
type Asset{
    id: ID!
    url: String!
}
type HouseQuery{
    room: RoomQuery
    yard: YardQuery
    cloud: CloudQuery
}
type Query{
    house(id: ID): HouseQuery
}
\`\`\`

5.2 Access pipes

The main reason why we use access pipes is to have control over which parts of the schema are available
to individual groups of schema consumers. By doing this, we can see how access control will work in
our system even during the graph creation phase.
To understand access pipes, we need to understand Role-Based Access Control (RBAC). RBAC is
a mechanism that allows us to control access to data based on user roles. It works by assigning each
user a role, which determines the resources available to them. In practice, when defining a GraphQL
schema, we can specify roles for individual object types and fields. We can define different roles such
as admin, user, or guest, and assign them specific read and write permissions for data using directives
or we can do it with access pipes. When a user sends a GraphQL query, their role is taken into account
during query execution. The GraphQL backend engine checks whether the user has the necessary
permissions to resolve the specific type. If the user lacks the appropriate permissions, the GraphQL
engine returns an appropriate “access denied” message.
This mechanism allows us to create secure and controlled API interfaces with RBAC and access pipes
in GraphQL. We can ensure that only authorized individuals have access to specific types, which is
particularly important for applications handling sensitive information such as user data or financial data.

Now, let’s take a look at an example using the IoT scenario, but this time, we will restrict access to certain
resources. This example will showcase access pipes. Imagine we have a family at home, and we want to
restrict access to photos and videos for our children. To do this, we will split CloudQuery accordingly:
\`\`\`graphql
interface CloudQuery{
    photos: [Asset!]
    videos: [Asset!]
}
type KidsQuery implements CloudQuery{
    photos: [Asset!]
    videos: [Asset!]
}
type ParentsQuery implements CloudQuery{
    photos: [Asset!]
    videos: [Asset!]
}
type Query{
    parents: ParentsQuery
    kids: KidsQuery
}
\`\`\`
Instead of returning photos and videos from the resolver of the CloudQuery type directly, we
transformed CloudQuery into an interface and created two separate queries named KidsQuery
and ParentsQuery. Then, in the backend system, we will determine who is making the request by
parsing request headers and we won’t allow kids to enter the ParentsQuery assets.

5.3 Ownership pipes
It often happens that the owner of a specific entity should be the only one with the authority to edit it.
In such cases, the ownership pipes pattern comes in handy, allowing editing of an object exclusively
by its owner.
One of the most common use cases for ownership pipes is a blog. Here, every user of a blog is also the
owner of their articles, and the only one who can edit them, add a cover image, set the publication
date, and so on. Additionally, there are blog readers who can comment on each article, as well as edit
their own comments and react to other comments. Once again, ownership of these objects and actions
lies with the user. Furthermore, each user – whether a blog writer or commenter – has access to their
own profile data and can edit it.
Just like in the previous section, we will start here by presenting the graph of our GraphQL schema
for a blogging system:

\`\`\`graphql
"""
An author of articles and comments
"""
type Author {
  """
  The unique identifier of the author
  """
  id: ID!
  
  """
  The name of the author
  """
  name: String!
  
  """
  The articles written by the author
  """
  articles: [Article!]!
  
  """
  The comments made by the author
  """
  comments: [Comment!]!
}


"""
An article written by an author
"""
type Article {
  """
  The unique identifier of the article
  """
  id: ID!
  
  """
  The title of the article
  """
  title: String!
  
  """
  The content of the article
  """
  content: String!
  
  """
  The author of the article
  """
  author: Author!
  
  """
  The comments on the article
  """
  comments: [Comment!]!
}

"""
A comment on an article
"""
type Comment {
  """
  The unique identifier of the comment
  """
  id: ID!
  
  """
  The content of the comment
  """
  content: String!
  
  """
  The author of the comment
  """
  author: Author!
}

"""
Root query type
"""
type Query {
  """
  Get all authors
  """
  authors: [Author!]!
  
  """
  Get an author by ID
  """
  author(
    id: ID!
  ): Author
  
  """
  Get all articles
  """
  articles: [Article!]!
  
  """
  Get an article by ID
  """
  article(
    id: ID!
  ): Article
  
  """
  Get the logged in user
  """
  me: Me
}

type Mutation {
  """
  Operations related to the logged in blog author and its owned data
  """
  me: AuthorOps
  
  """
  Operations related to reading articles by logged in user
  """
  article(
    id: ID!
  ): ArticleReaderOps
  
  """
  Operations related to commenting on articles by logged in user
  """
  comment(
    id: ID!
  ): CommentAuthorOps
}

"""
Operations related to reading articles
"""
type ArticleReaderOps {
  """
  Add a comment to an article
  """
  comment(
    """
    The content of the comment
    """
    content: String!
  ): ID!
}


"""
Operations related to commenting on articles
"""
type CommentAuthorOps {
  """
  Delete the comment
  """
  delete: Boolean!
  
  """
  Update the content of the comment
  """
  update(
    """
    The new content of the comment
    """
    content: String!
  ): Boolean!
}

"""
Operations related to the logged in user
"""
type AuthorOps {
  """
  Create a new article
  """
  createArticle(
    """
    The details of the article to create
    """
    article: CreateArticle!
  ): ID!
  
  """
  Operations related to managing an article
  """
  article(
    """
    The ID of the article
    """
    id: ID!
  ): ArticleAuthorOps
  
  """
  Operations related to managing authors comments
  """
  comment(
    """
    The ID of the comment
    """
    id: ID!
  ): CommentAuthorOps
}

"""
Operations related to managing an article
"""
type ArticleAuthorOps {
  """
  Delete the article
  """
  delete: Boolean!
  
  """
  Update the details of the article
  """
  update(
    """
    The updated details of the article
    """
    article: EditArticle!
  ): Boolean!
}

schema{
	query: Query
	mutation: Mutation
}

type Me{
	author: Author
}

"""
Input type for creating an article
"""
input CreateArticle {
  """
  The title of the article
  """
  title: String!
  
  """
  The content of the article
  """
  content: String!
}

"""
Input type for editing an article
"""
input EditArticle {
  """
  The updated title of the article
  """
  title: String
  
  """
  The updated content of the article
  """
  content: String
}
\`\`\`
`;
import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import openai from 'openai';
import clipboard from 'clipboardy';
import { config } from '@aexol/axolotl-config';
import * as path from 'path';
import { vaildateChatModel } from '@/codegen/utils.js';
import { oraPromise } from 'ora';

export const graphqlAiCommand = (program: Command) => {
  program
    .command('gai')
    .argument('<prompt>')
    .argument('[existing_schema_path]', 'path to the file containing existing schema')
    .description(`${chalk.greenBright('Axolotl ai')} - schema creator`)
    .action(createResolverFile);
};

export const createResolverFile = async (prompt: string, existing_schema_path?: string) => {
  const cfg = config.get();
  let extra_prompt_info = cfg.graphql_prompt_info;
  const agent_model = vaildateChatModel(cfg.agent_model || 'gpt-4.1');

  if (extra_prompt_info?.endsWith('.txt')) {
    extra_prompt_info = readFileSync(path.join(process.cwd(), extra_prompt_info), 'utf-8');
  }
  const system = `${graphqlAiPrompt}${extra_prompt_info ? `\nAlso take to account that:\n${extra_prompt_info}\n\n` : ''}  ${existing_schema_path ? `Please change that in the following existing schema code: ${readFileSync(path.join(process.cwd(), existing_schema_path), 'utf-8')}` : ''}`;
  const apiKey = process.env.OPEN_AI_API_KEY;
  if (!apiKey) throw new Error('Please provide OPEN_AI_API_KEY env variable');
  const ai = new openai({ apiKey: process.env.OPEN_AI_API_KEY });
  await oraPromise(
    ai.chat.completions
      .create({
        model: agent_model,
        messages: [
          {
            role: 'system',
            content: system,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      })
      .then((response) => {
        const res = response.choices.at(0)?.message.content;
        if (res) {
          clipboard.writeSync(res);
        }
        console.log(`Generated resolver has been copied to clipboard`);
      }),
    { spinner: 'binary', text: 'Thinking' },
  );
};
