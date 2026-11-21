import ts from 'typescript';
import path from 'node:path';

const file = process.argv[2];
const program = ts.createProgram([file], {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler, strict: true, skipLibCheck: true,
  types: ['node'], typeRoots: [path.join(process.cwd(), 'node_modules', '@types')],
});
const checker = program.getTypeChecker();
const sf = program.getSourceFile(file)!;
const isErr = (t: ts.Type) => (t as any).intrinsicName === 'error';
const leftmost = (name: ts.Node): ts.Node => {
  let n = name;
  for (;;) {
    if (ts.isQualifiedName(n)) n = n.left;
    else if (ts.isPropertyAccessExpression(n)) n = n.expression;
    else return n;
  }
};
const isNameChain = (n: ts.Node): boolean =>
  ts.isIdentifier(n) ||
  (ts.isQualifiedName(n) && isNameChain(n.left)) ||
  (ts.isPropertyAccessExpression(n) && isNameChain(n.expression));
function checkName(label: string, node: ts.Node, name: ts.Node) {
  for (const target of new Set([leftmost(name), name])) {
    const symbol = checker.getSymbolAtLocation(target);
    let verdict: string;
    if (symbol) {
      const decls = symbol.declarations ?? [];
      let unresolved: boolean;
      if (symbol.flags & ts.SymbolFlags.Alias) {
        unresolved = (checker.getAliasedSymbol(symbol).declarations ?? []).length === 0;
      } else if (decls.length > 0) {
        unresolved = false;
      } else {
        unresolved = isErr(checker.getTypeOfSymbol(symbol));
      }
      verdict = `symbol(${ts.SymbolFlags[symbol.flags] ?? symbol.flags}) decls=${decls.length} unresolved=${unresolved}`;
    } else {
      verdict = `NO SYMBOL; isNameChain=${isNameChain(target)}`;
    }
    console.log(`${label} [${target.getText()}]: ${verdict}`);
  }
}
function visit(node: ts.Node) {
  if (ts.isImportTypeNode(node)) {
    const arg = node.argument;
    const literal = ts.isLiteralTypeNode(arg) && ts.isStringLiteral(arg.literal) ? arg.literal : undefined;
    const moduleSymbol = literal ? checker.getSymbolAtLocation(literal) : undefined;
    let q = 'no-qualifier';
    if (node.qualifier) {
      const qs = checker.getSymbolAtLocation(node.qualifier);
      q = qs ? `qsym decls=${(qs.declarations ?? []).length}` : 'NO QSYM';
    }
    console.log(`ImportType [${node.getText()}]: module=${moduleSymbol ? 'ok' : 'MISSING'} ${q}`);
  }
  if (ts.isTypeReferenceNode(node)) checkName('TypeRef', node, node.typeName);
  else if (ts.isTypeQueryNode(node)) checkName('TypeQuery', node, node.exprName);
  else if (ts.isExpressionWithTypeArguments(node)) checkName('ExprWithTypeArgs', node, node.expression);
  ts.forEachChild(node, visit);
}
visit(sf);
