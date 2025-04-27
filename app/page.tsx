"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AtSign, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Twitter, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LandingPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    username?: string
    name?: string
  }>({})
  const router = useRouter()

  const { users, setCurrentUser, addUser } = useStore()

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("nexicon-current-user")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setCurrentUser(user)
      router.push("/feed")
    }
  }, [router, setCurrentUser])

  const validateForm = (type: "login" | "signup") => {
    const newErrors: {
      email?: string
      password?: string
      username?: string
      name?: string
    } = {}

    if (type === "login") {
      if (!username.trim()) {
        newErrors.username = "Username is required"
      }

      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    } else {
      if (!name.trim()) {
        newErrors.name = "Full name is required"
      }

      if (!username.trim()) {
        newErrors.username = "Username is required"
      } else if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters"
      }

      if (!email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid"
      }

      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm("login")) {
      return
    }

    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Find user by username (in a real app, you'd check password too)
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (user) {
        setCurrentUser(user)
        // Store user in localStorage for persistence
        localStorage.setItem("nexicon-current-user", JSON.stringify(user))

        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${user.name}!`,
          className: "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-none",
        })

        router.push("/feed")
      } else {
        setIsLoading(false)
        setErrors({
          username: "Invalid username or password",
        })
      }
    }, 1500)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm("signup")) {
      return
    }

    setIsLoading(true)

    // Check if username already exists
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      setErrors({
        username: "Username already taken. Please choose another one.",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // Create new user
      const newUser = {
        id: `user${uuidv4()}`,
        name,
        username,
        verified: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: "",
        location: "",
        website: "",
        joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        followers: 0,
        following: 0,
        posts: 0,
        online: true,
      }

      // Add user to store
      addUser(newUser)

      // Set as current user
      setCurrentUser(newUser)

      // Store user in localStorage for persistence
      localStorage.setItem("nexicon-current-user", JSON.stringify(newUser))

      toast({
        title: "Account created!",
        description: `Welcome to Nexicon, ${name}!`,
        className: "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-none",
      })

      router.push("/feed")
    }, 2000)
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)

    // Simulate social login
    setTimeout(() => {
      toast({
        title: "Social login",
        description: `${provider} login is not implemented in this demo.`,
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8 flex flex-col justify-center items-center text-white">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 relative h-20 w-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <span className="text-3xl font-bold gradient-text">N</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nexicon</h1>
          <p className="text-xl md:text-2xl mb-8">The Future of Social Media, Reimagined</p>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <AtSign className="h-5 w-5" />
              </div>
              <p className="text-left">Connect with friends and the world around you</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sparkles"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
              </div>
              <p className="text-left">Share your moments with immersive posts and stories</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shield"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <p className="text-left">Advanced privacy features to keep you in control</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="User"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="User"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="User"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
                alt="User"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-background to-background/95">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-none neomorphic frosted-glass">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="username"
                          className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value)
                            if (errors.username) {
                              setErrors({ ...errors, username: undefined })
                            }
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (errors.password) {
                              setErrors({ ...errors, password: undefined })
                            }
                          }}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="relative w-full">
                    <Separator className="absolute top-1/2 w-full" />
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => handleSocialLogin("GitHub")}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => handleSocialLogin("Twitter")}
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-none neomorphic frosted-glass">
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className={`pl-3 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value)
                            if (errors.name) {
                              setErrors({ ...errors, name: undefined })
                            }
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="username"
                          className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value)
                            if (errors.username) {
                              setErrors({ ...errors, username: undefined })
                            }
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (errors.email) {
                              setErrors({ ...errors, email: undefined })
                            }
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (errors.password) {
                              setErrors({ ...errors, password: undefined })
                            }
                          }}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-xs">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="relative w-full">
                    <Separator className="absolute top-1/2 w-full" />
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => handleSocialLogin("GitHub")}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => handleSocialLogin("Twitter")}
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

