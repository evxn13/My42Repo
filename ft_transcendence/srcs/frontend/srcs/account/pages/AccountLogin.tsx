import React					from 'react';
import { Link, useNavigate } 	from 'react-router-dom';
import { useState, useEffect }	from 'react';
import backgroundImage			from '../../website/src/assets/Background-Login.jpg';
import googleLogo				from './GoogleLogo.png';
import axiosClient 				from '../utils/axiosClient';
import { useAuth } 				from '../../website/src/hooks/useAuth';

interface FormProps {
	sendMessage: (message: string) => void;
}

const Form: React.FC<FormProps> = ({ sendMessage }) => {
	const [twoFactorCode, setTwoFactorCode] = useState<string>('');
	const [is2FARequired, setIs2FARequired] = useState<boolean>(false);
	const [URLid, setURLid] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);	
	const [tempUsername, setTempUsername] = useState<string | null>(null);
	const [tempPassword, setTempPassword] = useState<string | null>(null);

	const navigate = useNavigate();
	const { login, isAuthenticated } = useAuth();
	
	//for google2fa
	useEffect(() => {
	  const params = new URLSearchParams(window.location.search);
	  const isGoogle2FA: string | null = params.get("2faGoogle");
	  const id: string | null = params.get("id");
	  const emailParam: string | null = params.get("email");

	  if (isGoogle2FA === "true" && id && emailParam) {
		setIs2FARequired(true);
		setURLid(id);
		setEmail(emailParam);
	  }
	},[window.location.search]);

	useEffect(() => {
	  if (isAuthenticated)
		  navigate('/');
	}, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
	const form = event.target as HTMLFormElement;
	try {
		if (is2FARequired) { ///////////// HANDLE 2FA FLOWS ///////////////
			////////////// GOOGLE 2FA
		  if (URLid) {
			  const res = await axiosClient.post("/verify2fa-google", {
				  id: URLid,
				  token: twoFactorCode
			  });

			  if (res.data.success) {
				  sendMessage(`✅ 2FA validate with sucess !`);
				  login(res.data.token);
			  } else 
				sendMessage(res.data.error || "❌ Invalid code");
		  }
		  else {
			  ///////////// REGULAR 2FA
			  if (!tempPassword || !tempUsername) {
				sendMessage("❌ Username/Password missing");
				return;
			  }

				// console.log("TMP USERNAME = ". tempUsername);
				// console.log("TMP PASSWORD = ", tempPassword);
			  const response = await axiosClient.post("/login", {
				  username: tempUsername.toLowerCase(),
				  password: tempPassword,
				  twoFactorCode: twoFactorCode
			  });

			  if (response.status === 200 && response.data.token) {
				sendMessage(`✅ User ${tempUsername} connected with success !`);
				login(response.data.token);
				//navigate done by isAuthenticated
			  } else
			  	sendMessage(response.data.error || "Unknown error in REGULAR 2FA CHECK LOGIN");
		  }
		} else { /////////////////// REGULAR LOGIN NO 2FA ////////////////////
			const username = (form.elements.namedItem('username') as HTMLInputElement)?.value || '';
			const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || '';

			setTempUsername(username); //// save these for later 2FA check if needed
			setTempPassword(password);
			
			const response = await axiosClient.post("/login", {
				username: username.toLowerCase(),
				password: password
			});

			if (response.status === 200 && response.data.token) {
				sendMessage(`✅ User ${username} connected with success !`);
				login(response.data.token);
				//navigate done by isAuthenticated
			} else if (response.status === 206) {
				setIs2FARequired(true);
				setEmail(response.data.emailToSend)
				sendMessage("2FA needed, 6 digit code please my cutie");
			} else
				sendMessage(response.data.error || 'Unknown error AccountLogin');
		}
	} catch (err: any) { //for 40X Errors
		if (err.response) {
			if (err.response.status === 401)
				sendMessage(err.response.data.error || "User not found");
			else if (err.response.status === 403)
				sendMessage(err.response.data.error || "Access refused stupedasso");
			else if (err.response.status === 400)
				sendMessage(err.response.data.error || "Invalid inputs");
		}
		else if (err.request)
			sendMessage("❌ Impossible to connect to server");
		else
			sendMessage("❌ bruh.");
	}
  };

  const handleSend2faEmail = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

	let emailToSend: string | null = email;

	try {
		const res = await axiosClient.post("/send2faEmail", { email: emailToSend });

		if (res.status === 200) {
			sendMessage(`✅ 2FA code send to ${emailToSend || 'your email'} !`);
		} else {
			sendMessage(res.data.error || "❌ Failed to send to email.");
		}
	} catch (err: any) {
		console.error("Error while sending 2FA by mail: ", err);
		if (err.response && err.response.data && err.response.data.error) {
			sendMessage(`❌ ${err.response.data.error}`);
		} else {
			sendMessage("❌ Error while sendin 2FA by mail.");
		}
	}
  };

  return (
    <div className="w-full min-h-screen overflow-auto">
      <div
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Titre */}
        <div className="absolute top-5 left-20 petit:hidden">
          <h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
            Login_Page
          </h1>
        </div>

        <div className="w-[90%] sm:w-full flex justify-center ml-0 md:ml-[80px] -mt-28">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-12 w-[440px] min-h-[600px] flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Welcome Back
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
			{!is2FARequired && (
			<>
              <div>
                <label htmlFor="username" className="block text-white text-lg font-medium mb-3">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white text-lg font-medium mb-3">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
                  placeholder="Enter your password"
                  required
                />
              </div>
			 </>
			 )}
                {/* 2fAAAAAAAAAAAAAAAAA */}
				{is2FARequired && (
				  <div>
					<label htmlFor="twoFactorCode" className="block text-white text-lg font-medium mb-3">
					  Code 2FA
					</label>
					<input
					  type="text"
					  id="twoFactorCode"
					  name="twoFactorCode"
					  value={twoFactorCode}
					  onChange={(e) => setTwoFactorCode(e.target.value)}
					  className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
					  placeholder="Enter your 2FA code"
					  required
					/>	
						{/* BUTTON SEND 2FA CODE EMAIL */}
              		<button
					type="button"
					onClick={handleSend2faEmail}
                	className="w-full py-2 px-6 mt-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-medium hover:scale-[1.02] text-lg"
              		>
			    		Send code by email
             		</button>
				    <button
                	type="submit"
                	className="w-full py-4 px-6 mt-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-medium hover:scale-[1.02] text-lg"
              		>
                	 Validate code 2FA
              		</button>
				  </div>
					)}

			  
              {/* Sign Up Link */}
              
			  {!is2FARequired && (
				  <div className="text-center text-white text-base mt-6">
				    <div className="mb-4">
				      Don't have an account?{' '}
				      <Link to="/account/register" className="text-white/80 font-medium underline hover:text-white">
				        Register
				      </Link>
				    </div>

					<button
					type="submit"
                	className="w-full py-4 px-6 mt-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-medium hover:scale-[1.02] text-lg"
              		>
                	 Sign in
              		</button>

				    <div className="flex pt-4 justify-center">
				      <button
						  onClick={() => {
							window.location.href = `https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/auth/google`;
  }}
						  className="py-2 px-2 inline-flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
>
					  <img src={googleLogo} alt="Google Logo" className="w-6 h-6" />
					  </button>

				    </div>
				  </div>
			  )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountLogin: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const sendMessage = (newMessage: string): void => {
    setMessage(newMessage);
    setTimeout(() => {
      setMessage('');
    }, 5000); // Le message disparaît après 5 secondes
  };

  return (
    <div>
      <Form sendMessage={sendMessage} />
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[440px]">
        {message && (
          <div className="text-red-500 font-medium text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLogin;
