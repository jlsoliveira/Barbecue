import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container } from "@material-ui/core";
import { Redirect } from "react-router-dom";

import Footer from "../../components/Footer";
import "./style.sass";

const Login = (props) => {
  const [API] = useState(process.env.REACT_APP_API_ADDRESS);
  const [redirect, setRedirect] = useState(false);

  const schema = object().shape({
    email: string().required("O e-mail é obrigatório!"),
    password: string().required("A Senha é obrigatório!"),
  });

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const onSubmit = async (input, e) => {
    const response = await fetch(`${API}/users?email=${input.email}`);
    const users = await response.json();

    if (users.length > 0) {
      if (users[0].password.includes(input.password)) {
        setRedirect(true);
      } else {
        alert("password errada");
      }
    } else {
      alert("password errada");
    }

    e.target.reset();
  };

  const onError = (errors, e) => {
    // console.log(errors, e)
  };

  return redirect ? (
    <Redirect to="/churrascos" />
  ) : (
    <div>
      <main className="login-main">
        <Container maxWidth="sm">
          <section className="login">
            <div className="login-box">
              <h1>Agenda de Churrasco</h1>
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="e-mail"
                    isinvalid={`${!!errors.email}`}
                    ref={register}
                  />
                  {errors.email && <p className="error">{errors.email.message || "Requerido"}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="password">password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    password="password"
                    placeholder="Senha"
                    isinvalid={`${!!errors.password}`}
                    ref={register}
                  />
                  {errors.password && (
                    <p className="error">{errors.password.message || "Requerido"}</p>
                  )}
                </div>
                <div className="form-group">
                  <button type="submit" className="btn-default">
                    Logar
                  </button>
                </div>
              </form>
            </div>
          </section>
          <Footer />
        </Container>
      </main>
    </div>
  );
};

export default Login;
