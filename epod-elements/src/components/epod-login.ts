import { epodAuth, EpodAuthManager } from '../auth';
import { epodSharedStyles } from '../styles';

export class EpodLoginComponent extends HTMLElement {
    private shadow: ShadowRoot;
    private onLoginSuccess: ((token: string) => void) | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    setOnLoginSuccess(callback: (token: string) => void) {
        this.onLoginSuccess = callback;
    }

    connectedCallback() {
        this.render();
    }

    private async handleLogin(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const errorEl = this.shadow.querySelector('.epod-error') as HTMLElement;
        if (errorEl) errorEl.style.display = 'none';

        try {
            const response = await fetch('https://api.shipzy.me/api/v1/open/user/oauth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();
            const token = data.data?.token || data.token;
            if (!token) {
                throw new Error('No token received from server.');
            }

            epodAuth.setToken(token, 3600);

            if (this.onLoginSuccess) {
                this.onLoginSuccess(token);
            }
        } catch (err) {
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = err instanceof Error ? err.message : 'Login failed';
            }
        }
    }

    private injectStyles() {
        const style = document.createElement('style');
        style.textContent = epodSharedStyles + `
            .login-form { padding: 24px; max-width: 360px; margin: 0 auto; }
            .login-title { text-align: center; margin-bottom: 24px; }
            .form-group { margin-bottom: 16px; }
            .form-label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
            .form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--epod-border); border-radius: calc(var(--epod-radius) / 2); font-size: 14px; box-sizing: border-box; }
            .login-btn { width: 100%; margin-top: 8px; }
        `;
        this.shadow.appendChild(style);
    }

    render() {
        this.shadow.innerHTML = '';
        this.injectStyles();

        const container = document.createElement('div');
        container.className = 'epod-container';

        const formWrapper = document.createElement('div');
        formWrapper.className = 'login-form';

        const title = document.createElement('h3');
        title.className = 'epod-title login-title';
        title.textContent = 'Sign in to manage EPOD';
        formWrapper.appendChild(title);

        const errorEl = document.createElement('div');
        errorEl.className = 'epod-error';
        errorEl.style.display = 'none';
        errorEl.style.marginBottom = '12px';
        formWrapper.appendChild(errorEl);

        const form = document.createElement('form');

        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        const emailLabel = document.createElement('label');
        emailLabel.className = 'form-label';
        emailLabel.textContent = 'Email';
        const emailInput = document.createElement('input');
        emailInput.className = 'form-input';
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.placeholder = 'Enter your email';
        emailInput.required = true;
        emailGroup.appendChild(emailLabel);
        emailGroup.appendChild(emailInput);
        form.appendChild(emailGroup);

        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        const passwordLabel = document.createElement('label');
        passwordLabel.className = 'form-label';
        passwordLabel.textContent = 'Password';
        const passwordInput = document.createElement('input');
        passwordInput.className = 'form-input';
        passwordInput.type = 'password';
        passwordInput.name = 'password';
        passwordInput.placeholder = 'Enter your password';
        passwordInput.required = true;
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInput);
        form.appendChild(passwordGroup);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'epod-btn epod-btn-primary login-btn';
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Sign In';
        form.appendChild(submitBtn);

        const self = this;
        form.onsubmit = function(e) {
            self.handleLogin(e);
        };

        formWrapper.appendChild(form);
        container.appendChild(formWrapper);
        this.shadow.appendChild(container);
    }
}

customElements.define('shipzy-epod-login', EpodLoginComponent);
