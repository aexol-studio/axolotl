const isStringLiteralNode = (node) => {
  if (!node) return false;
  if (node.type === 'Literal' && typeof node.value === 'string') return true;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return true;
  return false;
};

const getJsxElementName = (node) => {
  if (!node) return null;
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'JSXMemberExpression') return node.property?.name ?? null;
  return null;
};

const qualityCheckRules = {
  'no-as-any': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow unsafe any casts',
      },
      messages: {
        noAsAny: 'Avoid `as any` (or `<any>`). Use a concrete type or narrowing.',
      },
      schema: [],
    },
    create(context) {
      return {
        TSAsExpression(node) {
          if (node.typeAnnotation?.type === 'TSAnyKeyword') {
            context.report({ node, messageId: 'noAsAny' });
          }
        },
        TSTypeAssertion(node) {
          if (node.typeAnnotation?.type === 'TSAnyKeyword') {
            context.report({ node, messageId: 'noAsAny' });
          }
        },
      };
    },
  },

  'no-hardcoded-toast': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow hardcoded toast string literals',
      },
      messages: {
        noHardcodedToast:
          'Wrap user-facing toast strings with t(...), e.g. toast.error(t("Message"))',
      },
      schema: [],
    },
    create(context) {
      return {
        CallExpression(node) {
          const [firstArg] = node.arguments;
          if (!isStringLiteralNode(firstArg)) return;

          // toast('...')
          if (node.callee.type === 'Identifier' && node.callee.name === 'toast') {
            context.report({ node: firstArg, messageId: 'noHardcodedToast' });
            return;
          }

          // toast.success('...'), toast.error('...'), etc.
          if (
            node.callee.type === 'MemberExpression' &&
            node.callee.object?.type === 'Identifier' &&
            node.callee.object.name === 'toast' &&
            node.callee.property?.type === 'Identifier' &&
            ['success', 'error', 'info', 'warning', 'message'].includes(node.callee.property.name)
          ) {
            context.report({ node: firstArg, messageId: 'noHardcodedToast' });
          }
        },
      };
    },
  },

  'no-jsx-literal-user-text': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Warn on raw JSX text that should be translated',
      },
      messages: {
        noLiteralText: 'Wrap user-facing text with t(...) instead of raw JSX text.',
      },
      schema: [],
    },
    create(context) {
      const ignoredTags = new Set(['code', 'pre']);

      return {
        JSXText(node) {
          const text = node.value?.trim();
          if (!text) return;
          if (!/[A-Za-z]/.test(text)) return;

          // Ignore short initials/badges (e.g., SC, AJ)
          if (/^[A-Z0-9]{1,3}$/.test(text)) return;

          const parent = node.parent;
          if (!parent || parent.type !== 'JSXElement') return;

          const tagName = getJsxElementName(parent.openingElement?.name);
          if (tagName && ignoredTags.has(tagName.toLowerCase())) return;

          context.report({ node, messageId: 'noLiteralText' });
        },
      };
    },
  },
};

export default qualityCheckRules;
