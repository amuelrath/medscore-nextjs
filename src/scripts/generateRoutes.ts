import fs from "fs";
import path from "path";
import ts from "typescript";

const appDirectory = path.join(process.cwd(), "/src/app");
const libDirectory = path.join(process.cwd(), "/src/lib");

function generateRoutes(
  directory: string,
  parentPath = ""
): ts.ObjectLiteralExpression {
  const properties: ts.ObjectLiteralElementLike[] = [];

  fs.readdirSync(directory).forEach((file: any) => {
    if (file.startsWith("_") || file.startsWith("@")) {
      return; // Skip files or folders starting with "_" or "@"
    }

    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const routeName = file.toUpperCase();
      const routePath = path.posix.join(parentPath, file);

      if (file.startsWith("[") && file.endsWith("]")) {
        const dynamicRouteName = file.slice(1, -1).toUpperCase();
        const dynamicRouteFunction = ts.factory.createArrowFunction(
          undefined,
          undefined,
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              "value",
              undefined,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
            ),
          ],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(
              dynamicRouteName,
              ts.factory.createTemplateExpression(
                ts.factory.createTemplateHead(routePath + "/"),
                [
                  ts.factory.createTemplateSpan(
                    ts.factory.createIdentifier("value"),
                    ts.factory.createTemplateTail("")
                  ),
                ]
              )
            ),
          ])
        );
        properties.push(
          ts.factory.createPropertyAssignment(
            dynamicRouteName,
            dynamicRouteFunction
          )
        );
      } else {
        properties.push(
          ts.factory.createPropertyAssignment(
            routeName,
            generateRoutes(filePath, routePath)
          )
        );
      }
    } else if (file === "page.tsx" || file === "page.ts") {
      const routeName = path.basename(directory).toUpperCase();
      const routePath = parentPath || "/";
      properties.push(
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier(routeName),
          ts.factory.createStringLiteral(routePath)
        )
      );
    }
  });

  return ts.factory.createObjectLiteralExpression(properties, true);
}

const ROUTES = generateRoutes(appDirectory);
const routesFile = ts.createSourceFile(
  "routes.generated.ts",
  "",
  ts.ScriptTarget.Latest,
  false,
  ts.ScriptKind.TS
);
const routesStatement = ts.factory.createVariableStatement(
  [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
  ts.factory.createVariableDeclarationList(
    [
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier("ROUTES"),
        undefined,
        undefined,
        ROUTES
      ),
    ],
    ts.NodeFlags.Const
  )
);
const routesFileContent = ts
  .createPrinter()
  .printNode(ts.EmitHint.Unspecified, routesStatement, routesFile);

fs.writeFileSync(
  path.join(libDirectory, "routes.generated.ts"),
  routesFileContent
);
