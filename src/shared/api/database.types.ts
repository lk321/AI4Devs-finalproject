export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          position: number
          slug: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          position?: number
          slug: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          position?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          buyer_read_at: string | null
          created_at: string
          id: string
          listing_id: string
          seller_read_at: string | null
        }
        Insert: {
          buyer_id: string
          buyer_read_at?: string | null
          created_at?: string
          id?: string
          listing_id: string
          seller_read_at?: string | null
        }
        Update: {
          buyer_id?: string
          buyer_read_at?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          seller_read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conversations_buyer_id_fkey'
            columns: ['buyer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_listing_id_fkey'
            columns: ['listing_id']
            isOneToOne: false
            referencedRelation: 'listings'
            referencedColumns: ['id']
          },
        ]
      }
      listing_images: {
        Row: {
          alt: string
          bytes: number
          id: string
          listing_id: string
          position: number
          url: string
        }
        Insert: {
          alt: string
          bytes: number
          id?: string
          listing_id: string
          position: number
          url: string
        }
        Update: {
          alt?: string
          bytes?: number
          id?: string
          listing_id?: string
          position?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'listing_images_listing_id_fkey'
            columns: ['listing_id']
            isOneToOne: false
            referencedRelation: 'listings'
            referencedColumns: ['id']
          },
        ]
      }
      listings: {
        Row: {
          buyer_id: string | null
          category_id: string
          city: string
          condition: Database['public']['Enums']['listing_condition']
          created_at: string
          description: string
          id: string
          latitude: number
          longitude: number
          price_cents: number
          published_at: string | null
          search_vector: unknown
          seller_id: string
          sold_at: string | null
          sold_price_cents: number | null
          status: Database['public']['Enums']['listing_status']
          title: string
          updated_at: string
        }
        Insert: {
          buyer_id?: string | null
          category_id: string
          city: string
          condition: Database['public']['Enums']['listing_condition']
          created_at?: string
          description: string
          id?: string
          latitude: number
          longitude: number
          price_cents: number
          published_at?: string | null
          search_vector?: unknown
          seller_id: string
          sold_at?: string | null
          sold_price_cents?: number | null
          status?: Database['public']['Enums']['listing_status']
          title: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string | null
          category_id?: string
          city?: string
          condition?: Database['public']['Enums']['listing_condition']
          created_at?: string
          description?: string
          id?: string
          latitude?: number
          longitude?: number
          price_cents?: number
          published_at?: string | null
          search_vector?: unknown
          seller_id?: string
          sold_at?: string | null
          sold_price_cents?: number | null
          status?: Database['public']['Enums']['listing_status']
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'listings_buyer_id_fkey'
            columns: ['buyer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'listings_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'listings_seller_id_fkey'
            columns: ['seller_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      offers: {
        Row: {
          amount_cents: number
          buyer_id: string
          conversation_id: string
          created_at: string
          id: string
          resolved_at: string | null
          status: Database['public']['Enums']['offer_status']
        }
        Insert: {
          amount_cents: number
          buyer_id: string
          conversation_id: string
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: Database['public']['Enums']['offer_status']
        }
        Update: {
          amount_cents?: number
          buyer_id?: string
          conversation_id?: string
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: Database['public']['Enums']['offer_status']
        }
        Relationships: [
          {
            foreignKeyName: 'offers_buyer_id_fkey'
            columns: ['buyer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'offers_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          alias: string
          city: string
          closed_deals: number
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          rating_average: number | null
          updated_at: string
        }
        Insert: {
          alias: string
          city: string
          closed_deals?: number
          created_at?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          rating_average?: number | null
          updated_at?: string
        }
        Update: {
          alias?: string
          city?: string
          closed_deals?: number
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          rating_average?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_id: string
          comment: string | null
          created_at: string
          id: string
          listing_id: string
          score: number
          subject_id: string
        }
        Insert: {
          author_id: string
          comment?: string | null
          created_at?: string
          id?: string
          listing_id: string
          score: number
          subject_id: string
        }
        Update: {
          author_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          score?: number
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_listing_id_fkey'
            columns: ['listing_id']
            isOneToOne: false
            referencedRelation: 'listings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      distance_km: {
        Args: { lat_a: number; lat_b: number; lng_a: number; lng_b: number }
        Returns: number
      }
      immutable_unaccent: { Args: { value: string }; Returns: string }
      is_listing_participant: {
        Args: { target_conversation: string }
        Returns: boolean
      }
      mark_listing_sold: {
        Args: { target_listing: string }
        Returns: undefined
      }
      release_reservation: {
        Args: { target_listing: string }
        Returns: undefined
      }
      resolve_offer: {
        Args: { accept: boolean; target_offer: string }
        Returns: undefined
      }
      search_listings: {
        Args: {
          category_slug?: string
          conditions?: Database['public']['Enums']['listing_condition'][]
          max_distance_km?: number
          max_price?: number
          min_price?: number
          origin_lat?: number
          origin_lng?: number
          page_number?: number
          page_size?: number
          search_term?: string
          sort_by?: string
        }
        Returns: {
          city: string
          condition: Database['public']['Enums']['listing_condition']
          cover_alt: string
          cover_url: string
          distance_km: number
          id: string
          price_cents: number
          published_at: string
          status: Database['public']['Enums']['listing_status']
          title: string
          total_count: number
        }[]
      }
      start_conversation: { Args: { target_listing: string }; Returns: string }
      unread_count: { Args: { target_conversation: string }; Returns: number }
    }
    Enums: {
      listing_condition: 'nuevo' | 'como_nuevo' | 'bueno' | 'aceptable' | 'para_piezas'
      listing_status: 'draft' | 'published' | 'reserved' | 'sold' | 'archived'
      offer_status: 'pending' | 'accepted' | 'rejected' | 'superseded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      listing_condition: ['nuevo', 'como_nuevo', 'bueno', 'aceptable', 'para_piezas'],
      listing_status: ['draft', 'published', 'reserved', 'sold', 'archived'],
      offer_status: ['pending', 'accepted', 'rejected', 'superseded'],
    },
  },
} as const
