import { IconAdd } from "./Icon/Icons/IconAdd";
import { IconEmail } from "./Icon/Icons/IconEmail";
import { createFromIconfont } from './Icon/createFrontIconfont'

function App() {
  const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js');

  return (
    <div style={ {padding: '50px'} }>
        <IconFont type="icon-shouye-zhihui" size="40px"></IconFont>
        <IconFont type="icon-gerenzhongxin-zhihui" fill="blue" size="40px"></IconFont>
    </div>
  );
}

export default App;
