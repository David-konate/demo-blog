import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signUpValidationSchema } from "../../utils/validationSchema";
import PasswordInput from "./PasswordInput"; // Importation du champ mot de passe
import "../../styles/login.css";
import { useAuthContext } from "../../context/use-user-contexte";
import AtomSpinner from "./Spinner";

const SignUpModal = ({ isOpen, onClose }) => {
  const { register, loading } = useAuthContext();

  if (!isOpen) return null;
  return loading ? (
    <AtomSpinner />
  ) : (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Créer un compte</h2>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signUpValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log("User data:", values);
            register(values);
            setSubmitting(false);
            onClose();
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="form-group">
                <label>Nom</label>
                <Field type="text" name="name" className="input-field" />
                <ErrorMessage name="name" component="p" className="error" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <Field type="email" name="email" className="input-field" />
                <ErrorMessage name="email" component="p" className="error" />
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <PasswordInput
                  name="password"
                  placeholder="Ton mot de passe"
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                />
                <ErrorMessage name="password" component="p" className="error" />
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <PasswordInput
                  name="confirmPassword"
                  placeholder="Confirme ton mot de passe"
                  value={values.confirmPassword}
                  onChange={(e) =>
                    setFieldValue("confirmPassword", e.target.value)
                  }
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="error"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || loading}
              >
                {loading ? <AtomSpinner /> : "S'inscrire"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpModal;
