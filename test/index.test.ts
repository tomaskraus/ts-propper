import P from '../src/index';

interface TEmployeeWithSimpleSalary {
  name: string;
  salary: number;
}

interface TSalary {
  amount: number;
  currency: string;
}

interface TEmployee {
  name: string;
  salary: TSalary;
}

interface TEmployeeWithMultipleSalaries {
  name: string;
  salaries: TSalary[];
}

describe('view', () => {
  test('Views the value correctly.', () => {
    const emp = {name: 'Alice', salary: 1200};
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const res = empSalaryProp.view(emp);

    expect(res).toEqual(1200);
  });

  test('Views the value from an object literal correctly.', () => {
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const res = empSalaryProp.view({name: 'Alice', salary: 1200});

    expect(res).toEqual(1200);
  });

  test('Returns undefined for an unknown property.', () => {
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary1'
    );
    const res = empSalaryProp.view({name: 'Alice', salary: 1200});

    expect(res).toBeUndefined();
  });

  test('Views nested property value correctly.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = empSalaryProp.view(emp);

    expect(res).toEqual(1450);
  });

  test('Views nested non-existent value as undefined.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount2');
    const res = empSalaryProp.view(emp);

    expect(res).toBeUndefined();
  });

  test('Views nested indexed value correctly.', () => {
    const emp = {
      name: 'Alice',
      salaries: [
        {amount: 1460, currency: 'AUD'},
        {amount: 1650, currency: 'AUD'},
      ],
    };
    const emp2ndSalaryProp = P.newInstance<
      TEmployeeWithMultipleSalaries,
      number
    >('salaries.1.amount');
    const res = emp2ndSalaryProp.view(emp);

    expect(res).toEqual(1650);
  });

  test('Views nested indexed non-existent value as undefined.', () => {
    const emp = {
      name: 'Alice',
      salaries: [
        {amount: 1460, currency: 'AUD'},
        {amount: 1650, currency: 'AUD'},
      ],
    };
    const empSalaryProp = P.newInstance<TEmployeeWithMultipleSalaries, number>(
      'salaries.2.amount'
    );
    const res = empSalaryProp.view(emp);

    expect(res).toBeUndefined();
  });

  test('Views nested non-existent value as undefined.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.price.a');
    const res = empSalaryProp.view(emp);

    expect(res).toBeUndefined();
  });

  test('Map: view nested value correctly.', () => {
    const emps = [
      {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}},
      {name: 'Bob', salary: {amount: 1200, currency: 'AUD'}},
    ];
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = emps.map(empSalaryProp.view);

    expect(res).toEqual([1450, 1200]);
  });
});

describe('set', () => {
  test('Sets the value to the prop. Does not modify the original object.', () => {
    const emp = {name: 'Alice', salary: 1450};
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const res = empSalaryProp.set(1000)(emp);

    expect(res).toEqual({
      name: 'Alice',
      salary: 1000,
    });
    expect(emp).toEqual({
      name: 'Alice',
      salary: 1450,
    });
  });

  test('Sets the value to the nested prop. Does not modify the original object.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = empSalaryProp.set(900)(emp);

    expect(res).toEqual({
      name: 'Alice',
      salary: {amount: 900, currency: 'AUD'},
    });
    expect(emp).toEqual({
      name: 'Alice',
      salary: {amount: 1450, currency: 'AUD'},
    });
  });

  test('Throws an error if attempts to set the value to a non-existent prop.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary2');

    expect(() => empSalaryProp.set(1000)(emp)).toThrow(/not found/);

    expect(emp).toEqual({
      name: 'Alice',
      salary: {amount: 1450, currency: 'AUD'},
    });
  });

  test('Throws error if attempts to set the value to a non-existent nested prop.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.price');

    expect(() => empSalaryProp.set(1000)(emp)).toThrow(/not found/);
    expect(emp).toEqual({
      name: 'Alice',
      salary: {amount: 1450, currency: 'AUD'},
    });
  });

  test('Map: set nested value correctly.', () => {
    const emps = [
      {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}},
      {name: 'Bob', salary: {amount: 1200, currency: 'AUD'}},
    ];
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = emps.map(empSalaryProp.set(800));

    expect(res).toEqual([
      {name: 'Alice', salary: {amount: 800, currency: 'AUD'}},
      {name: 'Bob', salary: {amount: 800, currency: 'AUD'}},
    ]);
  });
});

describe('evaluate', () => {
  test('Evaluates value correctly. Does not modify the original object.', () => {
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const emp = {
      name: 'Alice',
      salary: 1200,
    };
    const res = empSalaryProp.evaluate(x => x * 2)(emp);

    expect(res).toEqual(2400);

    expect(emp).toEqual({
      name: 'Alice',
      salary: 1200,
    });
  });

  test('Evaluates value correctly when an index argument is provided.', () => {
    const emp = {name: 'Alice', salary: 1200};
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const res = empSalaryProp.evaluate((x, i) => `${i}.${x}`)(emp, 10);

    expect(res).toEqual('10.1200');
  });

  test('Evaluates a nested value correctly.', () => {
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = empSalaryProp.evaluate(x => x * 2)({
      name: 'Alice',
      salary: {amount: 1450, currency: 'AUD'},
    });

    expect(res).toEqual(2900);
  });

  test('Throws an error when evaluates the non-existent prop.', () => {
    const empSalaryProp = P.newInstance<TEmployee, number>(
      'salary.amount.price'
    );

    expect(() =>
      empSalaryProp.evaluate(x => x * 2)({
        name: 'Alice',
        salary: {amount: 1450, currency: 'AUD'},
      })
    ).toThrow(/not found/);
  });

  test('Higher order func: evaluates nested value correctly.', () => {
    const emps = [
      {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}},
      {name: 'Bob', salary: {amount: 1200, currency: 'AUD'}},
    ];
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = emps.map(empSalaryProp.evaluate(x => x > 1300));

    expect(res).toEqual([true, false]);
  });
});

describe('over', () => {
  test('Overs value correctly. Does not modify the original object.', () => {
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const emp1 = {name: 'Alice', salary: 1200};
    const emp2 = empSalaryProp.over(x => x * 2)(emp1);

    expect(emp2).toEqual({name: 'Alice', salary: 2400});
    expect(emp1).toEqual({name: 'Alice', salary: 1200});
  });

  test('Overs value correctly when an index argument is provided.', () => {
    const emp = {name: 'Alice', salary: 1200};
    const empSalaryProp = P.newInstance<TEmployeeWithSimpleSalary, number>(
      'salary'
    );
    const res = empSalaryProp.over((x, i) => x + (i ? 10 * i : 0))(emp, 10);

    expect(res).toEqual({name: 'Alice', salary: 1300});
  });

  test('Throws an error when overs to the non-existent prop.', () => {
    const emp = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const empSalaryProp = P.newInstance<TEmployee, number>('salary2');

    expect(() => empSalaryProp.over(x => x + 100)(emp)).toThrow(/not found/);
    expect(emp).toEqual({
      name: 'Alice',
      salary: {amount: 1450, currency: 'AUD'},
    });
  });

  test('Overs a nested value correctly. Does not modify the original object.', () => {
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const emp1 = {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}};
    const emp2 = empSalaryProp.over(x => x * 2)(emp1);

    expect(emp2).toEqual({
      name: 'Alice',
      salary: {amount: 2900, currency: 'AUD'},
    });
    expect(emp1).toEqual({
      name: 'Alice',
      salary: {amount: 1450, currency: 'AUD'},
    });
  });

  test('Higher order func: over nested value correctly.', () => {
    const emps = [
      {name: 'Alice', salary: {amount: 1450, currency: 'AUD'}},
      {name: 'Bob', salary: {amount: 1200, currency: 'AUD'}},
    ];
    const empSalaryProp = P.newInstance<TEmployee, number>('salary.amount');
    const res = emps.map(empSalaryProp.over(x => x * 2));

    expect(res).toEqual([
      {name: 'Alice', salary: {amount: 2900, currency: 'AUD'}},
      {name: 'Bob', salary: {amount: 2400, currency: 'AUD'}},
    ]);
  });
});
