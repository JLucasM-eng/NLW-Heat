import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'
export function MessageList(){
    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className = {styles.messageList}>
                <li className={styles.message}>
                    <p className={styles.messageContent}>Testando, som , teste</p>
                    <div className = {styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src="https://github.com/JLucasM-eng.png" alt="Jose" />    
                        </div>    
                        <span>Zézé</span>
                    </div>
                </li>
                <li className={styles.message}>
                    <p className={styles.messageContent}>Testando, som , teste</p>
                    <div className = {styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src="https://github.com/JLucasM-eng.png" alt="Jose" />    
                        </div>    
                        <span>Zézé</span>
                    </div>
                </li>
                <li className={styles.message}>
                    <p className={styles.messageContent}>Testando, som , teste</p>
                    <div className = {styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src="https://github.com/JLucasM-eng.png" alt="Jose" />    
                        </div>    
                        <span>Zézé</span>
                    </div>
                </li>
                
            </ul>
        </div>
    )
}