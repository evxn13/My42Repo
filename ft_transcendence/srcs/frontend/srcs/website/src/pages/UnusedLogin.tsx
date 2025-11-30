// import { useState } from 'react';
// import backgroundImage from '../assets/Background-Login.jpg';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Logique de connexion à ajouter
//   };

//   return (
//     <div className="w-full min-h-screen overflow-auto">
//       <div
//         className="w-full min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
//         style={{ 
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundAttachment: 'fixed'
//         }}
//       >
//         {/* Titre */}
//         <div className="absolute top-5 left-20 petit:hidden">
//           <h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
//             Login_Page
//           </h1>
//         </div>

//         {/* Formulaire de connexion */}
//         <div className="w-full flex justify-center ml-0 md:ml-[80px] -mt-28">
//           <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-12 w-[440px] min-h-[600px] flex flex-col justify-center">
//             <h2 className="text-3xl font-bold text-white text-center mb-12">
//               Welcome Back
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Username/Email Input */}
//               <div>
//                 <label htmlFor="username" className="block text-white text-lg font-medium mb-3">
//                   Username or Email
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
//                   placeholder="Enter your username"
//                   required
//                 />
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label htmlFor="password" className="block text-white text-lg font-medium mb-3">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between text-base py-2">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     className="w-4 h-4 rounded bg-white/10 border-white/20 text-white focus:ring-white/40"
//                   />
//                   <label htmlFor="remember" className="ml-3 text-white">
//                     Remember me
//                   </label>
//                 </div>
//                 <a href="#" className="text-white hover:underline">
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full py-4 px-6 mt-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-medium hover:scale-[1.02] text-lg"
//               >
//                 Sign in
//               </button>

//               {/* Sign Up Link */}
//               <div className="text-center text-white text-base mt-6">
//                 Don't have an account?{' '}
//                 <a href="#" className="text-white hover:underline font-medium">
//                   Register
//                 </a>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;