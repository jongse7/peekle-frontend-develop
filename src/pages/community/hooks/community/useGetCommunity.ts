import { clientAuth } from '@/apis/client';
import { formatDateCardTime } from '@/utils/dateFormatter';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

// 커뮤니티 게시글 목록 API

const AuthorInfoSchema = z.object({
  nickname: z.string().nullable(),
  profileImage: z.string().nullable(),
  authorId: z.number().int().nullable(),
});

// Zod 스키마 정의
const ArticleSchema = z.object({
  articleId: z.number().int(),
  communityId: z.number().int(),
  title: z.string(),
  content: z.string(),
  isAnonymous: z.boolean().optional(),
  createdAt: z.string().transform(formatDateCardTime),
  updatedAt: z.string(),
  articleComments: z.number().int(),
  articleLikes: z.number().int(),
  isLikedByUser: z.boolean(),
  thumbnail: z.string().nullable(),
  authorInfo: AuthorInfoSchema,
});

const SuccessResponseSchema = z.object({
  message: z.string().nullable(),
  articles: z.array(ArticleSchema).nullable(),
  nextCursor: z.number().nullable(),
  hasNextPage: z.boolean(),
});

const CommunityResponseSchema = z.object({
  resultType: z.literal('SUCCESS').nullable(),
  error: z.string().nullable(),
  success: SuccessResponseSchema,
});

// 데이터 타입 추출
export type CommunityResponse = z.infer<typeof CommunityResponseSchema>;
export type Article = z.infer<typeof ArticleSchema>;

const getCommunity = async ({
  pageParam,
  limit = 5,
  communityId = 1,
  query,
}: {
  pageParam?: number;
  limit: number;
  communityId: number;
  query: string | null;
}): Promise<CommunityResponse | null> => {
  try {
    const response = await clientAuth<CommunityResponse>({
      method: 'GET',
      url: `/community/articles`,
      params: {
        limit,
        cursor: pageParam,
        communityId,
        query,
      },
    });

    // ✅ 204 No Content 처리
    if (response.status === 204) {
      console.log('📌 No Content - 더 이상 게시글이 없습니다.');
      return null;
    }

    return CommunityResponseSchema.parse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log('📌 404 Not Found - 더 이상 게시글이 없습니다.');
      return {
        resultType: 'SUCCESS',
        error: null,
        success: {
          message: null,
          articles: [],
          nextCursor: null,
          hasNextPage: false,
        },
      };
    } else if (axios.isAxiosError(error) && error.response?.status === 400) {
      return null;
    }
    console.error('❌ Zod 파싱 에러 또는 API 에러:', error);
    throw error;
  }
};

export const useGetCommunity = ({
  limit = 5,
  communityId = 1,
  query = null,
}: {
  limit?: number;
  communityId?: number;
  query?: string | null;
}) => {
  return useInfiniteQuery<CommunityResponse | null, AxiosError>({
    queryKey: ['get-community', communityId, query],
    queryFn: async ({ pageParam }) =>
      getCommunity({
        pageParam: pageParam as number | undefined,
        limit,
        communityId,
        query,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.success.nextCursor ?? undefined;
    },
  });
};
