import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TodoModel = runtime.Types.Result.DefaultSelection<Prisma.$TodoPayload>;
export type AggregateTodo = {
    _count: TodoCountAggregateOutputType | null;
    _min: TodoMinAggregateOutputType | null;
    _max: TodoMaxAggregateOutputType | null;
};
export type TodoMinAggregateOutputType = {
    id: string | null;
    content: string | null;
    done: boolean | null;
    ownerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TodoMaxAggregateOutputType = {
    id: string | null;
    content: string | null;
    done: boolean | null;
    ownerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TodoCountAggregateOutputType = {
    id: number;
    content: number;
    done: number;
    ownerId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TodoMinAggregateInputType = {
    id?: true;
    content?: true;
    done?: true;
    ownerId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TodoMaxAggregateInputType = {
    id?: true;
    content?: true;
    done?: true;
    ownerId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TodoCountAggregateInputType = {
    id?: true;
    content?: true;
    done?: true;
    ownerId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TodoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput | Prisma.TodoOrderByWithRelationInput[];
    cursor?: Prisma.TodoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TodoCountAggregateInputType;
    _min?: TodoMinAggregateInputType;
    _max?: TodoMaxAggregateInputType;
};
export type GetTodoAggregateType<T extends TodoAggregateArgs> = {
    [P in keyof T & keyof AggregateTodo]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTodo[P]> : Prisma.GetScalarType<T[P], AggregateTodo[P]>;
};
export type TodoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithAggregationInput | Prisma.TodoOrderByWithAggregationInput[];
    by: Prisma.TodoScalarFieldEnum[] | Prisma.TodoScalarFieldEnum;
    having?: Prisma.TodoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TodoCountAggregateInputType | true;
    _min?: TodoMinAggregateInputType;
    _max?: TodoMaxAggregateInputType;
};
export type TodoGroupByOutputType = {
    id: string;
    content: string;
    done: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: TodoCountAggregateOutputType | null;
    _min: TodoMinAggregateOutputType | null;
    _max: TodoMaxAggregateOutputType | null;
};
type GetTodoGroupByPayload<T extends TodoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TodoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TodoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TodoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TodoGroupByOutputType[P]>;
}>>;
export type TodoWhereInput = {
    AND?: Prisma.TodoWhereInput | Prisma.TodoWhereInput[];
    OR?: Prisma.TodoWhereInput[];
    NOT?: Prisma.TodoWhereInput | Prisma.TodoWhereInput[];
    id?: Prisma.StringFilter<"Todo"> | string;
    content?: Prisma.StringFilter<"Todo"> | string;
    done?: Prisma.BoolFilter<"Todo"> | boolean;
    ownerId?: Prisma.StringFilter<"Todo"> | string;
    createdAt?: Prisma.DateTimeFilter<"Todo"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Todo"> | Date | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TodoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    owner?: Prisma.UserOrderByWithRelationInput;
};
export type TodoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TodoWhereInput | Prisma.TodoWhereInput[];
    OR?: Prisma.TodoWhereInput[];
    NOT?: Prisma.TodoWhereInput | Prisma.TodoWhereInput[];
    content?: Prisma.StringFilter<"Todo"> | string;
    done?: Prisma.BoolFilter<"Todo"> | boolean;
    ownerId?: Prisma.StringFilter<"Todo"> | string;
    createdAt?: Prisma.DateTimeFilter<"Todo"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Todo"> | Date | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type TodoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TodoCountOrderByAggregateInput;
    _max?: Prisma.TodoMaxOrderByAggregateInput;
    _min?: Prisma.TodoMinOrderByAggregateInput;
};
export type TodoScalarWhereWithAggregatesInput = {
    AND?: Prisma.TodoScalarWhereWithAggregatesInput | Prisma.TodoScalarWhereWithAggregatesInput[];
    OR?: Prisma.TodoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TodoScalarWhereWithAggregatesInput | Prisma.TodoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Todo"> | string;
    content?: Prisma.StringWithAggregatesFilter<"Todo"> | string;
    done?: Prisma.BoolWithAggregatesFilter<"Todo"> | boolean;
    ownerId?: Prisma.StringWithAggregatesFilter<"Todo"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Todo"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Todo"> | Date | string;
};
export type TodoCreateInput = {
    id?: string;
    content: string;
    done?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutTodosInput;
};
export type TodoUncheckedCreateInput = {
    id?: string;
    content: string;
    done?: boolean;
    ownerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TodoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutTodosNestedInput;
};
export type TodoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TodoCreateManyInput = {
    id?: string;
    content: string;
    done?: boolean;
    ownerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TodoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TodoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TodoListRelationFilter = {
    every?: Prisma.TodoWhereInput;
    some?: Prisma.TodoWhereInput;
    none?: Prisma.TodoWhereInput;
};
export type TodoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TodoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TodoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TodoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TodoCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.TodoCreateWithoutOwnerInput, Prisma.TodoUncheckedCreateWithoutOwnerInput> | Prisma.TodoCreateWithoutOwnerInput[] | Prisma.TodoUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TodoCreateOrConnectWithoutOwnerInput | Prisma.TodoCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.TodoCreateManyOwnerInputEnvelope;
    connect?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
};
export type TodoUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.TodoCreateWithoutOwnerInput, Prisma.TodoUncheckedCreateWithoutOwnerInput> | Prisma.TodoCreateWithoutOwnerInput[] | Prisma.TodoUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TodoCreateOrConnectWithoutOwnerInput | Prisma.TodoCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.TodoCreateManyOwnerInputEnvelope;
    connect?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
};
export type TodoUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.TodoCreateWithoutOwnerInput, Prisma.TodoUncheckedCreateWithoutOwnerInput> | Prisma.TodoCreateWithoutOwnerInput[] | Prisma.TodoUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TodoCreateOrConnectWithoutOwnerInput | Prisma.TodoCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.TodoUpsertWithWhereUniqueWithoutOwnerInput | Prisma.TodoUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.TodoCreateManyOwnerInputEnvelope;
    set?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    disconnect?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    delete?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    connect?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    update?: Prisma.TodoUpdateWithWhereUniqueWithoutOwnerInput | Prisma.TodoUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.TodoUpdateManyWithWhereWithoutOwnerInput | Prisma.TodoUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.TodoScalarWhereInput | Prisma.TodoScalarWhereInput[];
};
export type TodoUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.TodoCreateWithoutOwnerInput, Prisma.TodoUncheckedCreateWithoutOwnerInput> | Prisma.TodoCreateWithoutOwnerInput[] | Prisma.TodoUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TodoCreateOrConnectWithoutOwnerInput | Prisma.TodoCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.TodoUpsertWithWhereUniqueWithoutOwnerInput | Prisma.TodoUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.TodoCreateManyOwnerInputEnvelope;
    set?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    disconnect?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    delete?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    connect?: Prisma.TodoWhereUniqueInput | Prisma.TodoWhereUniqueInput[];
    update?: Prisma.TodoUpdateWithWhereUniqueWithoutOwnerInput | Prisma.TodoUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.TodoUpdateManyWithWhereWithoutOwnerInput | Prisma.TodoUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.TodoScalarWhereInput | Prisma.TodoScalarWhereInput[];
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type TodoCreateWithoutOwnerInput = {
    id?: string;
    content: string;
    done?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TodoUncheckedCreateWithoutOwnerInput = {
    id?: string;
    content: string;
    done?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TodoCreateOrConnectWithoutOwnerInput = {
    where: Prisma.TodoWhereUniqueInput;
    create: Prisma.XOR<Prisma.TodoCreateWithoutOwnerInput, Prisma.TodoUncheckedCreateWithoutOwnerInput>;
};
export type TodoCreateManyOwnerInputEnvelope = {
    data: Prisma.TodoCreateManyOwnerInput | Prisma.TodoCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type TodoUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.TodoWhereUniqueInput;
    update: Prisma.XOR<Prisma.TodoUpdateWithoutOwnerInput, Prisma.TodoUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.TodoCreateWithoutOwnerInput, Prisma.TodoUncheckedCreateWithoutOwnerInput>;
};
export type TodoUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.TodoWhereUniqueInput;
    data: Prisma.XOR<Prisma.TodoUpdateWithoutOwnerInput, Prisma.TodoUncheckedUpdateWithoutOwnerInput>;
};
export type TodoUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.TodoScalarWhereInput;
    data: Prisma.XOR<Prisma.TodoUpdateManyMutationInput, Prisma.TodoUncheckedUpdateManyWithoutOwnerInput>;
};
export type TodoScalarWhereInput = {
    AND?: Prisma.TodoScalarWhereInput | Prisma.TodoScalarWhereInput[];
    OR?: Prisma.TodoScalarWhereInput[];
    NOT?: Prisma.TodoScalarWhereInput | Prisma.TodoScalarWhereInput[];
    id?: Prisma.StringFilter<"Todo"> | string;
    content?: Prisma.StringFilter<"Todo"> | string;
    done?: Prisma.BoolFilter<"Todo"> | boolean;
    ownerId?: Prisma.StringFilter<"Todo"> | string;
    createdAt?: Prisma.DateTimeFilter<"Todo"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Todo"> | Date | string;
};
export type TodoCreateManyOwnerInput = {
    id?: string;
    content: string;
    done?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TodoUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TodoUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TodoUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TodoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content?: boolean;
    done?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["todo"]>;
export type TodoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content?: boolean;
    done?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["todo"]>;
export type TodoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content?: boolean;
    done?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["todo"]>;
export type TodoSelectScalar = {
    id?: boolean;
    content?: boolean;
    done?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TodoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "content" | "done" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["todo"]>;
export type TodoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TodoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TodoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TodoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Todo";
    objects: {
        owner: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        content: string;
        done: boolean;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["todo"]>;
    composites: {};
};
export type TodoGetPayload<S extends boolean | null | undefined | TodoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TodoPayload, S>;
export type TodoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TodoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TodoCountAggregateInputType | true;
};
export interface TodoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Todo'];
        meta: {
            name: 'Todo';
        };
    };
    findUnique<T extends TodoFindUniqueArgs>(args: Prisma.SelectSubset<T, TodoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TodoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TodoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TodoFindFirstArgs>(args?: Prisma.SelectSubset<T, TodoFindFirstArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TodoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TodoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TodoFindManyArgs>(args?: Prisma.SelectSubset<T, TodoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TodoCreateArgs>(args: Prisma.SelectSubset<T, TodoCreateArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TodoCreateManyArgs>(args?: Prisma.SelectSubset<T, TodoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TodoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TodoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TodoDeleteArgs>(args: Prisma.SelectSubset<T, TodoDeleteArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TodoUpdateArgs>(args: Prisma.SelectSubset<T, TodoUpdateArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TodoDeleteManyArgs>(args?: Prisma.SelectSubset<T, TodoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TodoUpdateManyArgs>(args: Prisma.SelectSubset<T, TodoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TodoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TodoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TodoUpsertArgs>(args: Prisma.SelectSubset<T, TodoUpsertArgs<ExtArgs>>): Prisma.Prisma__TodoClient<runtime.Types.Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TodoCountArgs>(args?: Prisma.Subset<T, TodoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TodoCountAggregateOutputType> : number>;
    aggregate<T extends TodoAggregateArgs>(args: Prisma.Subset<T, TodoAggregateArgs>): Prisma.PrismaPromise<GetTodoAggregateType<T>>;
    groupBy<T extends TodoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TodoGroupByArgs['orderBy'];
    } : {
        orderBy?: TodoGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TodoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTodoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TodoFieldRefs;
}
export interface Prisma__TodoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    owner<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TodoFieldRefs {
    readonly id: Prisma.FieldRef<"Todo", 'String'>;
    readonly content: Prisma.FieldRef<"Todo", 'String'>;
    readonly done: Prisma.FieldRef<"Todo", 'Boolean'>;
    readonly ownerId: Prisma.FieldRef<"Todo", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Todo", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Todo", 'DateTime'>;
}
export type TodoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where: Prisma.TodoWhereUniqueInput;
};
export type TodoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where: Prisma.TodoWhereUniqueInput;
};
export type TodoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput | Prisma.TodoOrderByWithRelationInput[];
    cursor?: Prisma.TodoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TodoScalarFieldEnum | Prisma.TodoScalarFieldEnum[];
};
export type TodoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput | Prisma.TodoOrderByWithRelationInput[];
    cursor?: Prisma.TodoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TodoScalarFieldEnum | Prisma.TodoScalarFieldEnum[];
};
export type TodoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput | Prisma.TodoOrderByWithRelationInput[];
    cursor?: Prisma.TodoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TodoScalarFieldEnum | Prisma.TodoScalarFieldEnum[];
};
export type TodoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TodoCreateInput, Prisma.TodoUncheckedCreateInput>;
};
export type TodoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TodoCreateManyInput | Prisma.TodoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TodoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    data: Prisma.TodoCreateManyInput | Prisma.TodoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TodoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TodoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TodoUpdateInput, Prisma.TodoUncheckedUpdateInput>;
    where: Prisma.TodoWhereUniqueInput;
};
export type TodoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TodoUpdateManyMutationInput, Prisma.TodoUncheckedUpdateManyInput>;
    where?: Prisma.TodoWhereInput;
    limit?: number;
};
export type TodoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TodoUpdateManyMutationInput, Prisma.TodoUncheckedUpdateManyInput>;
    where?: Prisma.TodoWhereInput;
    limit?: number;
    include?: Prisma.TodoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TodoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where: Prisma.TodoWhereUniqueInput;
    create: Prisma.XOR<Prisma.TodoCreateInput, Prisma.TodoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TodoUpdateInput, Prisma.TodoUncheckedUpdateInput>;
};
export type TodoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
    where: Prisma.TodoWhereUniqueInput;
};
export type TodoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TodoWhereInput;
    limit?: number;
};
export type TodoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TodoSelect<ExtArgs> | null;
    omit?: Prisma.TodoOmit<ExtArgs> | null;
    include?: Prisma.TodoInclude<ExtArgs> | null;
};
export {};
