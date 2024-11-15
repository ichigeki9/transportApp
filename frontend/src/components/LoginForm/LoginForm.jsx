import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";

export function LoginForm() {
	const {register, getValues, handleSubmit} = useForm();

	function onSubmit(e){
        e.preventDefault()
        const formValues = getValues()
        console.log(formValues);
        
    }

	return (
        <>
        <h1>Login</h1>
		<form onSubmit={onSubmit} action="">
			<div className={styles.inputBox}>
				<label htmlFor="username">Użytkownik: </label>
				<input id="username"  placeholder="login" {...register("username")}			/>
			</div>

			<div className="inputBox">
				<label htmlFor="password">Hasło:</label>
				<input id="password" placeholder="Hasło" {...register("password")} />
			</div>
			<div>
				<button>Zaloguj</button>
			</div>
		</form>
        </>
	);
}
