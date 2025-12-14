// Authentication management
import { supabase } from './supabase.js';

let currentUser = null;
let authListeners = [];

// Initialize auth state
export async function initAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user ?? null;
    notifyAuthListeners();
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user ?? null;
      notifyAuthListeners();
    });
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback) {
  authListeners.push(callback);
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
}

// Notify all listeners of auth state change
function notifyAuthListeners() {
  authListeners.forEach(listener => listener(currentUser));
}

// Sign in
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return currentUser;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export function getUser() {
  return currentUser;
}

// Check if user is authenticated
export function isAuthenticated() {
  return currentUser !== null;
}

