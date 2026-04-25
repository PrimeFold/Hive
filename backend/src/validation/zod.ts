import z from 'zod'

export const signupSchema = z.object({
    username: z.string().min(3).max(30),
    displayName:z.string().min(5).max(25),
    email:z.email(),
    password:z.string().min(6)
})

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(6)
})

export const usernameSchema = z.object({
    username:z.string().min(3).max(25)
})

export const emailSchema = z.object({
    email:z.email()
})

export const channelSchema = z.object({
    name:z.string().min(4).max(25)
})




