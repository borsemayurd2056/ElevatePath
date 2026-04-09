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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      careers: {
        Row: {
          category: Database["public"]["Enums"]["career_category"]
          created_at: string
          demand_level: string | null
          description: string | null
          education_paths: Json | null
          icon: string | null
          id: string
          required_skills: string[] | null
          salary_range_max: number | null
          salary_range_min: number | null
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["career_category"]
          created_at?: string
          demand_level?: string | null
          description?: string | null
          education_paths?: Json | null
          icon?: string | null
          id?: string
          required_skills?: string[] | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["career_category"]
          created_at?: string
          demand_level?: string | null
          description?: string | null
          education_paths?: Json | null
          icon?: string | null
          id?: string
          required_skills?: string[] | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          career_opportunities: string[] | null
          category: Database["public"]["Enums"]["career_category"] | null
          created_at: string
          description: string | null
          duration: string | null
          education_stages:
            | Database["public"]["Enums"]["education_stage"][]
            | null
          eligibility: string | null
          id: string
          name: string
          required_skills: string[] | null
        }
        Insert: {
          career_opportunities?: string[] | null
          category?: Database["public"]["Enums"]["career_category"] | null
          created_at?: string
          description?: string | null
          duration?: string | null
          education_stages?:
            | Database["public"]["Enums"]["education_stage"][]
            | null
          eligibility?: string | null
          id?: string
          name: string
          required_skills?: string[] | null
        }
        Update: {
          career_opportunities?: string[] | null
          category?: Database["public"]["Enums"]["career_category"] | null
          created_at?: string
          description?: string | null
          duration?: string | null
          education_stages?:
            | Database["public"]["Enums"]["education_stage"][]
            | null
          eligibility?: string | null
          id?: string
          name?: string
          required_skills?: string[] | null
        }
        Relationships: []
      }
      entrance_exams: {
        Row: {
          created_at: string
          description: string | null
          eligibility: string | null
          full_name: string | null
          id: string
          important_dates: Json | null
          name: string
          preparation_tips: string[] | null
          syllabus_overview: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          eligibility?: string | null
          full_name?: string | null
          id?: string
          important_dates?: Json | null
          name: string
          preparation_tips?: string[] | null
          syllabus_overview?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          eligibility?: string | null
          full_name?: string | null
          id?: string
          important_dates?: Json | null
          name?: string
          preparation_tips?: string[] | null
          syllabus_overview?: string | null
        }
        Relationships: []
      }
      mentor_profiles: {
        Row: {
          available_slots: Json | null
          created_at: string
          experience_years: number | null
          expertise: string[]
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_slots?: Json | null
          created_at?: string
          experience_years?: number | null
          expertise?: string[]
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_slots?: Json | null
          created_at?: string
          experience_years?: number | null
          expertise?: string[]
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_questions: {
        Row: {
          answer: string | null
          answered_at: string | null
          created_at: string
          id: string
          mentor_id: string | null
          question: string
          student_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          created_at?: string
          id?: string
          mentor_id?: string | null
          question: string
          student_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          created_at?: string
          id?: string
          mentor_id?: string | null
          question?: string
          student_id?: string
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          notes: string | null
          scheduled_date: string
          status: string | null
          student_id: string
          time_slot: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          notes?: string | null
          scheduled_date: string
          status?: string | null
          student_id: string
          time_slot: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          notes?: string | null
          scheduled_date?: string
          status?: string | null
          student_id?: string
          time_slot?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          education_stage: Database["public"]["Enums"]["education_stage"] | null
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          education_stage?:
            | Database["public"]["Enums"]["education_stage"]
            | null
          full_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          education_stage?:
            | Database["public"]["Enums"]["education_stage"]
            | null
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answers: Json
          created_at: string
          education_stage: Database["public"]["Enums"]["education_stage"] | null
          id: string
          results: Json | null
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          education_stage?:
            | Database["public"]["Enums"]["education_stage"]
            | null
          id?: string
          results?: Json | null
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          education_stage?:
            | Database["public"]["Enums"]["education_stage"]
            | null
          id?: string
          results?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "mentor"
      career_category:
        | "technology"
        | "medical"
        | "business"
        | "government"
        | "creative"
      education_stage:
        | "after_10th"
        | "after_12th_science"
        | "after_12th_commerce"
        | "after_12th_arts"
        | "after_diploma"
        | "after_graduation"
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
      app_role: ["student", "mentor"],
      career_category: [
        "technology",
        "medical",
        "business",
        "government",
        "creative",
      ],
      education_stage: [
        "after_10th",
        "after_12th_science",
        "after_12th_commerce",
        "after_12th_arts",
        "after_diploma",
        "after_graduation",
      ],
    },
  },
} as const
