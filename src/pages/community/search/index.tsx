import * as S from './style';
import { Backward, CommunityCard, TextFields } from '@/components';
import * as SS from '../../event/search/style';
import BodySection from '../container/body-section';
import { useRecentSearch } from '@/hooks';
import { useGetCommunity } from '../hooks/query/useGetCommunity';
import { useInfiniteScroll } from '../hooks/util/useInfiniteScroll';

export default function CommunitySearchPage() {
  const {
    query,
    isSearched,
    recentSearch,
    handleClear,
    handleRemoveRecentSearch,
    handleRecentSearchClick,
  } = useRecentSearch({
    queryKey: 'community-search',
    localKey: 'recent-community-search',
  });

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommunity({
    limit: 5,
    query: query ?? '',
    communityId: 1,
  });

  const articles = data?.pages.flatMap((page) => page.success.articles) ?? [];

  const { lastElementRef } = useInfiniteScroll({
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  });

  return (
    <>
      <S.MainContainer>
        <S.Appbar>
          <Backward size={'28px'} />
          <TextFields
            queryKey="community-search"
            localKey="recent-community-search"
            placeholder="글 제목, 내용을 검색해보세요"
            min_width={333}
            max_width={333}
          />
        </S.Appbar>

        {/* 최근 검색어 목록 */}
        {!isSearched &&
          (recentSearch.length > 0 ? (
            <SS.RecentSearchContainer>
              <SS.RecentSearchRow>
                <SS.RecentSearchTitle>최근 검색</SS.RecentSearchTitle>
                <SS.ClearButton onClick={handleClear}>전체 삭제</SS.ClearButton>
              </SS.RecentSearchRow>
              <SS.RecentSearchTextContainer>
                {recentSearch.map((search) => (
                  <SS.RecentSearchRow
                    key={search}
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <SS.RecentSearchText>{search}</SS.RecentSearchText>
                    <SS.XIcon
                      onClick={(e) => handleRemoveRecentSearch(search, e)}
                    />
                  </SS.RecentSearchRow>
                ))}
              </SS.RecentSearchTextContainer>
            </SS.RecentSearchContainer>
          ) : (
            <SS.NoRecentSearch />
          ))}

        {/* 에러 발생 시 */}
        {error && (
          <BodySection.None
            subTitle={`"${query}"에 관한\n첫 게시글을 작성해보세요!`}
          ></BodySection.None>
        )}

        {/* 로딩 UI */}
        {isLoading && <BodySection.Skeleton />}

        {/* 검색된 게시글 리스트 */}
        {isSearched && articles.length > 0 && (
          <BodySection>
            {articles.map((article, index, arr) => (
              <CommunityCard
                key={`${article.communityId}, ${article.articleId}, ${index}`}
                communityId={article.communityId}
                articleId={article.articleId}
                title={article.title}
                content={article.content}
                date={article.createdAt}
                articleComments={article.articleComments}
                articleLikes={article.articleLikes}
                thumbnail={article.thumbnail}
                ref={index === arr.length - 1 ? lastElementRef : null}
              />
            ))}
          </BodySection>
        )}

        {/* 추가 로딩 중이면 표시 */}
        {isFetchingNextPage && <BodySection.Skeleton />}
      </S.MainContainer>
    </>
  );
}
