import {  Form } from "react-bootstrap";

export const ListMonth = ({  setMonth, month }) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <>
      {" "}
      <Form.Group className="form-outline mb-lg-4 mb-1">
        <Form.Label htmlFor="aspects" className="textForm">
          Selecciona un mes
        </Form.Label>
        <Form.Select
          name="month"
          id="month"
          className={`border border-success`}
          onChange={(e) => setMonth(e.target.value)}
          value={month}
        >
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1 > 9 ? i + 1 : "0" + (i + 1)}>
              {m}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </>
  );
};
