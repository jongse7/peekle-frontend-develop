import * as S from './style';
import { TextFields, CategoryChips, SquareButton } from '@/components';
import { useBottomSheetStore } from '@/stores';
import { BOTTOM_SHEET_ID_EVENT_FILTER } from '@/constants/event';

const MapHeader = () => {
  const { setActiveBottomSheet } = useBottomSheetStore();
  return (
    <S.HeaderContainer>
      <S.SearchBarWrapper>
        <TextFields
          queryKey={'event-search'}
          placeholder={'관심 있는 활동 검색'}
          localKey={'recent-event-search'}
          page={'eventMap'}
          min_width={200}
        />
        <SquareButton
          icon="filter"
          onClick={() => {
            setActiveBottomSheet(BOTTOM_SHEET_ID_EVENT_FILTER);
          }}
        />
      </S.SearchBarWrapper>
      <CategoryChips />
    </S.HeaderContainer>
  );
};

export default MapHeader;

// import * as S from './style';
// import { CategoryChips, SquareButton } from '@/components';
// import { useBottomSheetStore } from '@/stores';
// import { BOTTOM_SHEET_ID_EVENT_FILTER } from '@/constants/event';

// const MapHeader = () => {
//   const { setActiveBottomSheet } = useBottomSheetStore();
//   return (
//     <S.HeaderContainer>
//       <S.SearchBarWrapper>
//         <CategoryChips />
//         <SquareButton
//           icon="filter"
//           onClick={() => {
//             setActiveBottomSheet(BOTTOM_SHEET_ID_EVENT_FILTER);
//           }}
//         />
//       </S.SearchBarWrapper>
//     </S.HeaderContainer>
//   );
// };

// export default MapHeader;
