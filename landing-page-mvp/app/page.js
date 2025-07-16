'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState('Not tested')
  const [userCount, setUserCount] = useState(null)
  const [authTest, setAuthTest] = useState('Not tested')

  const testSupabaseConnection = async () => {
    try {
      setConnectionStatus('Testing...')
      
      // Test 1: Simple connection to user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1)

      if (error) {
        setConnectionStatus(`❌ Database Error: ${error.message}`)
      } else {
        setConnectionStatus('✅ Database connected!')
        
        // Test 2: Count user profiles
        const { count, error: countError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
        
        if (!countError) {
          setUserCount(count)
        }
      }
    } catch (err) {
      setConnectionStatus(`❌ Connection failed: ${err.message}`)
    }
  }

  const testAuth = async () => {
    try {
      setAuthTest('Testing...')
      
      // Test auth service
      const { data, error } = await supabase.auth.getUser()
      
      if (error) {
        setAuthTest(`✅ Auth service working (no user logged in)`)
      } else {
        setAuthTest(`✅ Auth service working (user: ${data.user?.email || 'anonymous'})`)
      }
    } catch (err) {
      setAuthTest(`❌ Auth test failed: ${err.message}`)
    }
  }

const testEmailSignup = async () => {
  try {
    // Generate a unique test email
    const testEmail = `frontend-test-${Date.now()}@example.com`
    
    console.log('Testing frontend email signup with:', testEmail)
    
    // Method 1: Try with explicit session check
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log('Current session:', sessionData.session ? 'Authenticated' : 'Anonymous')
    
    // Method 2: Insert with better error handling
    const { data, error } = await supabase
      .from('email_signups')
      .insert([{  // Note: wrapping in array
        email: testEmail,
        source: 'landing_page'
      }])
      .select()

    if (error) {
      console.error('Detailed error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Try alternative approach with upsert
      console.log('Trying upsert method...')
      const { data: upsertData, error: upsertError } = await supabase
        .from('email_signups')
        .upsert({
          email: testEmail,
          source: 'landing_page_upsert'
        })
        .select()
      
      if (upsertError) {
        return `❌ Both methods failed: ${error.message}`
      } else {
        return `✅ Upsert method worked! Added: ${testEmail}`
      }
    } else {
      console.log('Email signup successful:', data)
      return `✅ Email signup working! Added: ${testEmail}`
    }
  } catch (err) {
    console.error('Email signup exception:', err)
    return `❌ Exception: ${err.message}`
  }
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          🎨 Kid Coloring Book MVP
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your child's photos into magical coloring book adventures
        </p>
        
        {/* Setup Status */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Setup Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-green-600 font-semibold">
              ✅ Next.js 15.x Ready
            </div>
            <div className="text-blue-600 font-semibold">
              ✅ Tailwind CSS Working  
            </div>
            <div className="text-purple-600 font-semibold">
              ✅ App Router Configured
            </div>
            <div className="text-orange-600 font-semibold">
              ✅ Supabase Client Installed
            </div>
          </div>
        </div>

        {/* Supabase Tests */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Supabase Tests</h2>
          
          <div className="space-y-4">
            {/* Database Connection Test */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded">
              <div className="mb-2 sm:mb-0">
                <strong>Database Connection:</strong> 
                <span className="ml-2 font-mono text-sm">{connectionStatus}</span>
                {userCount !== null && (
                  <div className="text-sm text-gray-600">
                    User profiles in DB: {userCount}
                  </div>
                )}
              </div>
              <button 
                onClick={testSupabaseConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Test Database
              </button>
            </div>

            {/* Auth Test */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded">
              <div className="mb-2 sm:mb-0">
                <strong>Authentication:</strong> 
                <span className="ml-2 font-mono text-sm">{authTest}</span>
              </div>
              <button 
                onClick={testAuth}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Test Auth
              </button>
            </div>

            {/* Quick Email Test */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded">
              <div className="mb-2 sm:mb-0">
                <strong>Email Signup:</strong> 
                <span className="ml-2 text-sm text-gray-600">Test email_signups table</span>
              </div>
              <button 
                onClick={async () => {
                  const result = await testEmailSignup()
                  alert(result)
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Test Email Table
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Make sure to add your Supabase credentials to <code>.env.local</code> 
              and enable Row Level Security (RLS) policies in your Supabase dashboard.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 text-gray-600">
          <p>Once all tests pass, we'll build:</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Landing Page</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Authentication</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">File Upload</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Success Page</span>
          </div>
        </div>
      </div>
    </main>
  )
}
