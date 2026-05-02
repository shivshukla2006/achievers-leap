export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alumni: {
        Row: {
          created_at: string
          exam: string
          featured: boolean
          id: string
          image_url: string | null
          name: string
          rank: string | null
          review: string
          score: string
          student_class: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          exam: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          rank?: string | null
          review: string
          score: string
          student_class: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          exam?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          rank?: string | null
          review?: string
          score?: string
          student_class?: string
          visible?: boolean
        }
        Relationships: []
      }
      announcements: {
        Row: {
          active: boolean
          body: string
          created_at: string
          ends_at: string | null
          id: string
          starts_at: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          active: boolean
          class_range: string
          created_at: string
          description: string
          display_order: number
          duration: string
          exam: string
          features: string[]
          id: string
          image_url: string | null
          price: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          class_range: string
          created_at?: string
          description: string
          display_order?: number
          duration: string
          exam: string
          features?: string[]
          id?: string
          image_url?: string | null
          price?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          class_range?: string
          created_at?: string
          description?: string
          display_order?: number
          duration?: string
          exam?: string
          features?: string[]
          id?: string
          image_url?: string | null
          price?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          display_order: number
          id: string
          question: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          question: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          question?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          visible: boolean
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          visible?: boolean
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          visible?: boolean
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          author_id: string
          author_name: string
          created_at: string
          id: string
          lead_id: string
          note: string
        }
        Insert: {
          author_id: string
          author_name: string
          created_at?: string
          id?: string
          lead_id: string
          note: string
        }
        Update: {
          author_id?: string
          author_name?: string
          created_at?: string
          id?: string
          lead_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          course_interest: string | null
          created_at: string
          email: string
          exam: string
          id: string
          last_contacted_at: string | null
          message: string | null
          name: string
          phone: string
          priority: string
          source: string | null
          status: string
          student_class: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          course_interest?: string | null
          created_at?: string
          email: string
          exam: string
          id?: string
          last_contacted_at?: string | null
          message?: string | null
          name: string
          phone: string
          priority?: string
          source?: string | null
          status?: string
          student_class: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          course_interest?: string | null
          created_at?: string
          email?: string
          exam?: string
          id?: string
          last_contacted_at?: string | null
          message?: string | null
          name?: string
          phone?: string
          priority?: string
          source?: string | null
          status?: string
          student_class?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          recipient_id: string
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          recipient_id: string
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          recipient_id?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          block_key: string
          body: string | null
          data: Json
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          block_key: string
          body?: string | null
          data?: Json
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_key?: string
          body?: string | null
          data?: Json
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          experience_years: number
          id: string
          image_url: string | null
          name: string
          qualification: string
          subject: string
          updated_at: string
          user_id: string | null
          visible: boolean
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          experience_years?: number
          id?: string
          image_url?: string | null
          name: string
          qualification: string
          subject: string
          updated_at?: string
          user_id?: string | null
          visible?: boolean
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          experience_years?: number
          id?: string
          image_url?: string | null
          name?: string
          qualification?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_teacher_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher"],
    },
  },
} as const
