const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const quote = (text: string) => `"${text}"`;

/**
 * Generate a Primary Key by a given table and columns
 *
 * @param {string } tableName - The table for which the PK will be generated
 * @param {string[]} columns - List of columns which will be used to form the PK
 * @returns {string} - The string representation of the generated PK
 */
export const pkName = (tableName: string, columns: string[]): string => {
  return quote(`PK_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}`);
};

/**
 * Generate a Foreign Key by a given tables and columns
 *
 * @param {string } tableName - The source table which will be used in the FK
 * @param {string[]} columns - List of source columns which will be used to form the FK
 * @param {string } targetTableName - The target table which will be the destination part in the link
 * @param {string[]} targetColumns - List of target columns which will be used to map the connection between the tables
 * @returns {string} - The string representation of the generated FK
 */
export const fkName = (
  tableName: string,
  columns: string[],
  targetTableName: string,
  targetColumns: string[],
): string => {
  return quote(
    `FK_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}_${upperFirst(
      targetTableName,
    )}_${targetColumns.map(lowerFirst).join('_')}`,
  );
};

export const uqName = (tableName: string, columns: string[]) => {
  return quote(`UQ_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}`);
};

export const addPK = (tableName: string, columns: string[]) => {
  return `CONSTRAINT ${pkName(tableName, columns)} PRIMARY KEY (${columns.map(quote).join(', ')})`;
};
export const addFK = (tableName: string, columns: string[], targetTableName: string, targetColumns: string[]) => {
  return (
    `CONSTRAINT ${fkName(tableName, columns, targetTableName, targetColumns)} ` +
    `FOREIGN KEY (${columns.map(quote).join(', ')}) REFERENCES ${quote(
      upperFirst(targetTableName),
    )} (${targetColumns.map(quote).join(', ')})`
  );
};
export const addUQ = (tableName: string, columns: string[]) => {
  return `CONSTRAINT ${uqName(tableName, columns)} UNIQUE (${columns.map(quote).join(', ')})`;
};
export const addIX = (tableName: string, columns: string[]) => {
  return `CONSTRAINT ${uqName(tableName, columns)} UNIQUE (${columns.map(quote).join(', ')})`;
};
