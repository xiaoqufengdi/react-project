import { useState, useEffect } from 'react';
import './search-input.less';
interface searchInputIfs {
  placeholder?: string;
  searchValue?: string;
  style?: React.CSSProperties;
  isImmediateSearch?: React.CSSProperties;
  onSearch?: { (kw: string): void };
}
const SearchInput = (props: searchInputIfs): JSX.Element => {
  const { placeholder = '搜索', style, searchValue, isImmediateSearch = true, onSearch } = props;
  const [kw, setKw] = useState(searchValue ?? '');

  useEffect(() => {
    if (searchValue !== kw) {
      setKw(searchValue ?? '');
    }
  }, [searchValue]);

  return (
    <div className={'app-search-component'} style={style}>
      <div
        className={'icon-search'}
        onClick={() => {
          onSearch && onSearch(kw);
        }}
      >
        <img src={'/img/icons/icon-search.png'} alt={'搜索'} />
      </div>
      <input
        value={kw}
        onChange={(e) => {
          setKw(() => e.target.value);
          if (isImmediateSearch && onSearch) {
            onSearch(e.target.value);
          }
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
